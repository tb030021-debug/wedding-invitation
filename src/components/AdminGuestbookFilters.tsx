"use client";

export type AdminFilters = {
  side: "ALL" | "GROOM_SIDE" | "BRIDE_SIDE";
  hidden: "ALL" | "VISIBLE" | "HIDDEN";
  order: "desc" | "asc";
  keyword: string;
  includeHiddenExport: boolean;
};

type AdminGuestbookFiltersProps = {
  filters: AdminFilters;
  onChange: (filters: AdminFilters) => void;
  downloadHref: string;
};

export default function AdminGuestbookFilters({
  filters,
  onChange,
  downloadHref
}: AdminGuestbookFiltersProps) {
  return (
    <div className="rounded-lg border border-champagne bg-white p-4 shadow-soft">
      <div className="grid gap-3 md:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr]">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink/55">검색</span>
          <input
            className="muted-input"
            value={filters.keyword}
            onChange={(event) => onChange({ ...filters, keyword: event.target.value })}
            placeholder="이름 또는 메시지"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink/55">구분</span>
          <select
            className="muted-input"
            value={filters.side}
            onChange={(event) => onChange({ ...filters, side: event.target.value as AdminFilters["side"] })}
          >
            <option value="ALL">전체</option>
            <option value="GROOM_SIDE">신랑측</option>
            <option value="BRIDE_SIDE">신부측</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink/55">숨김</span>
          <select
            className="muted-input"
            value={filters.hidden}
            onChange={(event) =>
              onChange({ ...filters, hidden: event.target.value as AdminFilters["hidden"] })
            }
          >
            <option value="ALL">전체</option>
            <option value="VISIBLE">공개</option>
            <option value="HIDDEN">숨김</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-ink/55">정렬</span>
          <select
            className="muted-input"
            value={filters.order}
            onChange={(event) => onChange({ ...filters, order: event.target.value as AdminFilters["order"] })}
          >
            <option value="desc">최신순</option>
            <option value="asc">오래된순</option>
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <label className="flex min-h-11 items-center gap-2 rounded-lg bg-ivory px-3 text-sm font-medium text-ink/70">
          <input
            type="checkbox"
            checked={filters.includeHiddenExport}
            onChange={(event) => onChange({ ...filters, includeHiddenExport: event.target.checked })}
          />
          다운로드에 숨김 메시지 포함
        </label>
        <a className="primary-button" href={downloadHref}>
          CSV 다운로드
        </a>
      </div>
    </div>
  );
}
