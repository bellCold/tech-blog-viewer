"use client";

import { useState } from "react";
import { BlogSource } from "@/lib/api";

const VISIBLE_COUNT = 6;

interface Props {
  sources: BlogSource[];
  selected: number | null;
  onSelect: (id: number | null) => void;
}

export default function SourceFilter({ sources, selected, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = sources.length > VISIBLE_COUNT;
  const visible = expanded ? sources : sources.slice(0, VISIBLE_COUNT);

  return (
    <div className="flex flex-wrap items-center gap-2">
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
      {visible.map((source) => (
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
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-full border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600"
        >
          {expanded ? "접기" : `+${sources.length - VISIBLE_COUNT}개 더보기`}
        </button>
      )}
    </div>
  );
}
