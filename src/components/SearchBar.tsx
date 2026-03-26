"use client";

import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "recent-searches";
const MAX_HISTORY = 10;

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSearch(keyword: string) {
  const searches = getRecentSearches().filter((s) => s !== keyword);
  searches.unshift(keyword);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(searches.slice(0, MAX_HISTORY))
  );
}

function removeSearch(keyword: string) {
  const searches = getRecentSearches().filter((s) => s !== keyword);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

function clearAllSearches() {
  localStorage.removeItem(STORAGE_KEY);
}

interface Props {
  onSearch: (keyword: string) => void;
  onClear: () => void;
}

export default function SearchBar({ onSearch, onClear }: Props) {
  const [value, setValue] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSearches = value.trim()
    ? recentSearches.filter((s) =>
        s.toLowerCase().includes(value.trim().toLowerCase())
      )
    : recentSearches;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      saveSearch(trimmed);
      setRecentSearches(getRecentSearches());
      setShowHistory(false);
      onSearch(trimmed);
    }
  };

  const handleSelectHistory = (keyword: string) => {
    setValue(keyword);
    saveSearch(keyword);
    setRecentSearches(getRecentSearches());
    setShowHistory(false);
    onSearch(keyword);
  };

  const handleRemoveHistory = (e: React.MouseEvent, keyword: string) => {
    e.stopPropagation();
    removeSearch(keyword);
    setRecentSearches(getRecentSearches());
  };

  const handleClearAll = () => {
    clearAllSearches();
    setRecentSearches([]);
  };

  const handleClear = () => {
    setValue("");
    onClear();
  };

  const handleFocus = () => {
    setRecentSearches(getRecentSearches());
    setShowHistory(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setShowHistory(true);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="기술 블로그 검색..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-20 text-sm outline-none transition-colors focus:border-gray-400 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500 dark:focus:bg-gray-800"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg px-2 py-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              지우기
            </button>
          )}
          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            검색
          </button>
        </div>
      </form>

      {showHistory && filteredSearches.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between px-4 pb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              최근 검색어
            </span>
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              전체 삭제
            </button>
          </div>
          {filteredSearches.map((keyword) => (
            <button
              key={keyword}
              onClick={() => handleSelectHistory(keyword)}
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="truncate">{keyword}</span>
              <span
                onClick={(e) => handleRemoveHistory(e, keyword)}
                className="ml-2 shrink-0 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                삭제
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
