type AdminStats = {
  totalCount: number;
  groomCount: number;
  brideCount: number;
  hiddenCount: number;
};

type AdminStatsCardsProps = {
  stats: AdminStats;
};

const statLabels: Array<{ key: keyof AdminStats; label: string }> = [
  { key: "totalCount", label: "전체" },
  { key: "groomCount", label: "신랑측" },
  { key: "brideCount", label: "신부측" },
  { key: "hiddenCount", label: "숨김" }
];

export default function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {statLabels.map((item) => (
        <div key={item.key} className="rounded-lg border border-champagne bg-white p-4 shadow-soft">
          <p className="text-xs font-semibold text-gold">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{stats[item.key]}</p>
        </div>
      ))}
    </div>
  );
}
