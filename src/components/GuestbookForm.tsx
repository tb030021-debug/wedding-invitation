"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { submitGuestbookMessage, type GuestbookPayload, type GuestbookSide } from "@/utils/guestbook";

type GuestbookFormProps = {
  onCreated: () => void;
};

const sideOptions: Array<{ label: string; value: GuestbookSide }> = [
  { label: "신랑측", value: "GROOM_SIDE" },
  { label: "신부측", value: "BRIDE_SIDE" }
];

export default function GuestbookForm({ onCreated }: GuestbookFormProps) {
  const [form, setForm] = useState<GuestbookPayload>({
    name: "",
    side: "GROOM_SIDE",
    message: "",
    password: ""
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");

    if (!/^\d{4}$/.test(form.password)) {
      setStatus("삭제용 비밀번호는 숫자 4자리로 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitGuestbookMessage({
        name: form.name.trim(),
        side: form.side,
        message: form.message.trim(),
        password: form.password.trim()
      });
      setForm({ name: "", side: form.side, message: "", password: "" });
      setStatus("축하 메시지가 등록되었습니다.");
      onCreated();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <label className="block">
        <span className="sr-only">이름</span>
        <input
          className="muted-input"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="이름"
          maxLength={20}
          autoComplete="name"
          required
        />
      </label>

      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="하객 구분">
        {sideOptions.map((option) => {
          const selected = form.side === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={`min-h-11 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                selected
                  ? "border-gold bg-ink text-white"
                  : "border-gold/25 bg-white text-ink hover:bg-ivory"
              }`}
              onClick={() => setForm((prev) => ({ ...prev, side: option.value }))}
              role="radio"
              aria-checked={selected}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <label className="block">
        <span className="sr-only">메시지</span>
        <textarea
          className="muted-input min-h-28 resize-none"
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          placeholder="따뜻한 축하 메시지를 남겨주세요"
          maxLength={300}
          required
        />
      </label>

      <label className="block">
        <span className="sr-only">삭제용 비밀번호</span>
        <input
          className="muted-input"
          value={form.password}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              password: event.target.value.replace(/\D/g, "").slice(0, 4)
            }))
          }
          placeholder="삭제용 비밀번호 숫자 4자리"
          type="password"
          inputMode="numeric"
          pattern="[0-9]{4}"
          minLength={4}
          maxLength={4}
          autoComplete="new-password"
          aria-describedby="guestbook-password-hint"
          required
        />
        <span id="guestbook-password-hint" className="mt-1.5 block px-1 text-xs text-ink/45">
          메시지를 삭제할 때 사용할 숫자 4자리를 입력해 주세요.
        </span>
      </label>

      <button type="submit" className="primary-button w-full disabled:opacity-60" disabled={isSubmitting}>
        <Send aria-hidden size={17} />
        {isSubmitting ? "등록 중" : "등록"}
      </button>

      {status ? (
        <p className="text-center text-sm leading-6 text-ink/62" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
