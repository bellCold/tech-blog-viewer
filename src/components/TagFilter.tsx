"use client";

const TAG_COLORS: Record<string, string> = {
  "프론트엔드": "bg-blue-100 text-blue-700",
  "백엔드": "bg-green-100 text-green-700",
  "모바일": "bg-purple-100 text-purple-700",
  "AI/ML": "bg-rose-100 text-rose-700",
  "DevOps": "bg-orange-100 text-orange-700",
  "인프라": "bg-slate-100 text-slate-700",
  "보안": "bg-red-100 text-red-700",
  "데이터": "bg-cyan-100 text-cyan-700",
  "문화/조직": "bg-amber-100 text-amber-700",
  "QA/테스트": "bg-teal-100 text-teal-700",
};

export function getTagColor(tag: string): string {
  return TAG_COLORS[tag] || "bg-gray-100 text-gray-700";
}

interface Props {
  tags: string[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, selected, onSelect }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          selected === null
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        전체
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === tag
              ? "bg-gray-900 text-white"
              : `${getTagColor(tag)} hover:opacity-80`
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
