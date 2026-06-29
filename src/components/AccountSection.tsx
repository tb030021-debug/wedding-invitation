"use client";

import { ChevronDown, Copy, WalletCards } from "lucide-react";
import { useState } from "react";
import { weddingData, type AccountPerson } from "@/data/wedding";
import { copyToClipboard } from "@/utils/copy";
import SectionShell from "./SectionShell";

type AccountSide = "groom" | "bride";

const accountGroups: AccountSide[] = ["groom", "bride"];

function accountToText(account: AccountPerson) {
  return `${account.bank} ${account.accountNumber} ${account.name}`;
}

export default function AccountSection() {
  const [openSide, setOpenSide] = useState<AccountSide | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (account: AccountPerson) => {
    const text = accountToText(account);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(text);
      window.setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  const handleKakaoPay = (url: string) => {
    window.location.href = url;
  };

  return (
    <SectionShell kicker="Thanks" title="마음 전하실 곳">
      <div className="space-y-3">
        {accountGroups.map((side) => {
          const group = weddingData.accounts[side];
          const isOpen = openSide === side;
          return (
            <div key={group.title} className="overflow-hidden rounded-lg border border-champagne bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                onClick={() => setOpenSide(isOpen ? null : side)}
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-ink">{group.title}</span>
                <ChevronDown
                  aria-hidden
                  size={18}
                  className={`shrink-0 text-gold transition ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen ? (
                <div className="space-y-3 border-t border-champagne/70 bg-ivory/45 p-4">
                  {group.people.map((account) => {
                    const accountText = accountToText(account);
                    const copied = copiedKey === accountText;

                    return (
                      <div
                        key={accountText}
                        className="rounded-lg border border-white bg-white/90 p-4"
                      >
                        <div className="space-y-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gold">{account.relation}</p>
                            <p className="mt-1 text-sm font-semibold text-ink">{account.name}</p>
                            <p className="mt-2 break-words text-sm leading-6 text-ink/65">
                              {account.bank} {account.accountNumber}
                            </p>
                            {copied ? (
                              <p className="mt-2 text-xs font-semibold text-rose" role="status">
                                계좌번호가 복사되었습니다
                              </p>
                            ) : null}
                          </div>
                          <div
                            className={`grid gap-2 ${
                              account.kakaoPayUrl ? "grid-cols-2" : "grid-cols-1"
                            }`}
                          >
                            <button
                              type="button"
                              className="icon-button w-full px-3"
                              onClick={() => handleCopy(account)}
                              aria-label={`${account.name} 계좌 복사`}
                            >
                              <Copy aria-hidden size={16} />
                              <span aria-hidden>{copied ? "완료" : "계좌 복사"}</span>
                            </button>
                            {account.kakaoPayUrl ? (
                              <button
                                type="button"
                                className="primary-button w-full px-3"
                                onClick={() => handleKakaoPay(account.kakaoPayUrl)}
                              >
                                <WalletCards aria-hidden size={16} />
                                카카오페이
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
