import type { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  kicker?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export default function SectionShell({
  id,
  kicker,
  title,
  children,
  className = ""
}: SectionShellProps) {
  return (
    <section id={id} className={`section-panel ${className}`}>
      <div className="mb-5 space-y-2 text-center">
        {kicker ? <p className="section-kicker">{kicker}</p> : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </section>
  );
}
