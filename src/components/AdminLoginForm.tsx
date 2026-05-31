"use client";

import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "로그인에 실패했습니다.");
      }

      window.location.href = "/admin";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block">
        <span className="sr-only">아이디</span>
        <input
          className="muted-input"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="아이디"
          autoComplete="username"
        />
      </label>
      <label className="block">
        <span className="sr-only">비밀번호</span>
        <input
          className="muted-input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="비밀번호"
          type="password"
          autoComplete="current-password"
        />
      </label>
      <button type="submit" className="primary-button w-full disabled:opacity-60" disabled={isSubmitting}>
        <LogIn aria-hidden size={17} />
        {isSubmitting ? "로그인 중" : "로그인"}
      </button>
      {message ? (
        <p className="text-center text-sm leading-6 text-rose" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
