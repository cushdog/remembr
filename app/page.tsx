'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function SearchPage() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLoginButtonClick = () => {
    router.push('/login');
  };

  const handleLogoutButtonClick = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();
  };

  return (
    <div className="relative flex justify-center items-center h-screen">
      {user ? (
        <Button onClick={handleLogoutButtonClick} className="absolute top-4 right-4">Logout</Button>
      ) : (
        <Button onClick={handleLoginButtonClick} className="absolute top-4 right-4">Login</Button>
      )}
    </div>
  );
}
