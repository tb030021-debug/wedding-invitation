import { weddingData } from "@/data/wedding";
import SectionShell from "./SectionShell";

export default function InvitationSection() {
  return (
    <SectionShell kicker="Invitation" title="소중한 분들을 초대합니다">
      <div className="space-y-6 text-center">
        <p className="whitespace-pre-line text-[1.05rem] leading-8 text-ink/72">
          {weddingData.invitationMessage}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-ink">
          <span>
            신랑 <strong className="ml-1 font-semibold">{weddingData.groomName}</strong>
          </span>
          <span className="h-4 w-px bg-champagne" aria-hidden />
          <span>
            신부 <strong className="ml-1 font-semibold">{weddingData.brideName}</strong>
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
