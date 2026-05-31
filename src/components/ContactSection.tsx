import { MessageCircle, Phone } from "lucide-react";
import { weddingData, type PersonContact } from "@/data/wedding";
import SectionShell from "./SectionShell";

function ContactCard({ contact }: { contact: PersonContact }) {
  return (
    <div className="rounded-lg border border-champagne bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-gold">{contact.label}</p>
          <p className="mt-1 text-base font-semibold text-ink">{contact.name}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-ink transition hover:bg-champagne"
            href={`tel:${contact.phone}`}
            aria-label={`${contact.label} ${contact.name}에게 전화하기`}
          >
            <Phone aria-hidden size={18} />
          </a>
          <a
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-ink transition hover:bg-champagne"
            href={`sms:${contact.phone}`}
            aria-label={`${contact.label} ${contact.name}에게 문자하기`}
          >
            <MessageCircle aria-hidden size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ContactSection() {
  const couple: PersonContact[] = [
    { label: "신랑", name: weddingData.groomName, phone: weddingData.groomPhone },
    { label: "신부", name: weddingData.brideName, phone: weddingData.bridePhone }
  ];

  return (
    <SectionShell kicker="Contact" title="연락하기">
      <div className="space-y-5">
        <div className="grid gap-3">
          {couple.map((contact) => (
            <ContactCard key={contact.label} contact={contact} />
          ))}
        </div>

        <div>
          <p className="mb-3 text-center text-sm font-semibold text-ink/65">혼주 연락처</p>
          <div className="grid gap-3">
            {weddingData.parents.map((contact) => (
              <ContactCard key={`${contact.label}-${contact.phone}`} contact={contact} />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
