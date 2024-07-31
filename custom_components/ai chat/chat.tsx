import React, { useState, useEffect, useRef } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

interface AiChatProps {
  initialMessage: string;
  onClose: () => void;
}

const AiChat: React.FC<AiChatProps> = ({ initialMessage, onClose }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'system', content: 'You are a helpful assistant discussing a user\'s note.' },
    { role: 'user', content: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let aiResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const eventData = line.slice(6);
            if (eventData === '[DONE]') {
              setIsLoading(false);
              break;
            }
            try {
              const data = JSON.parse(eventData);
              if (data.content) {
                aiResponse += data.content;
                setMessages(prev => [
                  ...prev.slice(0, -1),
                  { role: 'assistant', content: aiResponse }
                ]);
              }
              if (data.error) {
                console.error('Error from server:', data.error);
                setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
              }
            } catch (error) {
              console.error('Error parsing event data:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to send message. Please try again.' }]);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        {messages.slice(2).map((message, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '5px', backgroundColor: message.role === 'user' ? '#e6f2ff' : '#f0f0f0', borderRadius: '5px' }}>
            <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong> {message.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flexGrow: 1, marginRight: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>Send</button>
      </form>
      <button onClick={onClose} style={{ marginTop: '10px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#f44336', color: 'white', border: 'none' }}>Close Chat</button>
    </div>
  );
};

export default AiChat;
