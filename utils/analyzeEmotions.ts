import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export function analyzeEmotion(text: string) {
  const result = sentiment.analyze(text);
  
  if (result.score >= 3) return 'Very Positive';
  if (result.score > 0) return 'Positive';
  if (result.score === 0) return 'Neutral';
  if (result.score > -3) return 'Negative';
  return 'Very Negative';
}