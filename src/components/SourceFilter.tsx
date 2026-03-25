"use client";

import { BlogSource } from "@/lib/api";

interface Props {
  sources: BlogSource[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export default function SourceFilter({ sources, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selected === null
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        전체
      </button>
      {sources.map((source) => (
        <button
          key={source.id}
          onClick={() => onSelect(source.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === source.id
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {source.name}
        </button>
      ))}
    </div>
  );
}
