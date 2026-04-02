"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BlogPostListItem,
  BlogSource,
  VisitorStats,
  fetchPosts,
  fetchSources,
  fetchTags,
  fetchVisitorStats,
  recordVisit,
  searchPosts,
} from "@/lib/api";
import PostCard from "@/components/PostCard";
import SourceFilter from "@/components/SourceFilter";
import TagFilter from "@/components/TagFilter";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import StatusSidebar from "@/components/StatusIndicator";
import ThemeToggle from "@/components/ThemeToggle";

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const gridRef = useRef<HTMLDivElement>(null);
  const [sidebarTop, setSidebarTop] = useState(0);

  const pageParam = Number(searchParams.get("page") || "0");
  const sourceParam = searchParams.get("source")
    ? Number(searchParams.get("source"))
    : null;
  const tagParam = searchParams.get("tag") || null;
  const keywordParam = searchParams.get("keyword") || null;

  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [sources, setSources] = useState<BlogSource[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);

  const updateURL = useCallback(
    (params: {
      page?: number;
      source?: number | null;
      tag?: string | null;
      keyword?: string | null;
    }) => {
      const url = new URLSearchParams();
      const page = params.page ?? pageParam;
      const source = params.source !== undefined ? params.source : sourceParam;
      const tag = params.tag !== undefined ? params.tag : tagParam;
      const keyword =
        params.keyword !== undefined ? params.keyword : keywordParam;

      if (page > 0) url.set("page", String(page));
      if (source) url.set("source", String(source));
      if (tag) url.set("tag", tag);
      if (keyword) url.set("keyword", keyword);

      const qs = url.toString();
      router.push(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router, pageParam, sourceParam, tagParam, keywordParam]
  );

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = keywordParam
        ? await searchPosts(keywordParam, pageParam, 12)
        : await fetchPosts(
            pageParam,
            12,
            sourceParam ?? undefined,
            tagParam ?? undefined
          );
      setPosts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (e) {
      console.error("Failed to load posts", e);
    } finally {
      setLoading(false);
    }
  }, [pageParam, sourceParam, tagParam, keywordParam]);

  useEffect(() => {
    if (gridRef.current) {
      setSidebarTop(gridRef.current.getBoundingClientRect().top + window.scrollY);
    }
  });

  useEffect(() => {
    fetchSources().then(setSources).catch(console.error);
    fetchTags().then(setTags).catch(console.error);
    recordVisit()
      .then(() => fetchVisitorStats())
      .then(setVisitorStats)
      .catch(console.error);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSourceSelect = (id: number | null) => {
    updateURL({ page: 0, source: id, tag: null, keyword: null });
  };

  const handleTagSelect = (tag: string | null) => {
    updateURL({ page: 0, source: null, tag, keyword: null });
  };

  const handleSearch = (keyword: string) => {
    updateURL({ page: 0, source: null, tag: null, keyword });
  };

  const handleClearSearch = () => {
    updateURL({ page: 0, keyword: null });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Tech Blog Hub
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                기술 블로그 {totalElements}개의 글을 모아봅니다
              </p>
            </div>
            <div className="flex items-center gap-2">
              <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
              <ThemeToggle />
            </div>
          </div>
          <div className="space-y-3">
            <SourceFilter
              sources={sources}
              selected={sourceParam}
              onSelect={handleSourceSelect}
            />
            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <TagFilter
              tags={tags}
              selected={tagParam}
              onSelect={handleTagSelect}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {keywordParam && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              &ldquo;{keywordParam}&rdquo; 검색 결과 {totalElements}건
            </span>
            <button
              onClick={handleClearSearch}
              className="rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              검색 해제
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-52 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center text-gray-400 dark:text-gray-500">
            게시글이 없습니다
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-10">
          <Pagination
            page={pageParam}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      {visitorStats && (
        <div
          className="absolute hidden 2xl:block rounded-2xl border border-gray-200/60 bg-white/90 shadow-lg shadow-gray-200/50 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/90 dark:shadow-black/20"
          style={{ top: 32, left: "calc(50% - 620px - 14rem)" }}
        >
          <div className="border-b border-gray-200/60 px-5 py-2.5 dark:border-gray-700/60">
            <span className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400">전체 방문자</span>
          </div>
          <div className="px-5 py-4">
            <div className="text-3xl font-extrabold tabular-nums text-gray-900 dark:text-gray-100">
              {visitorStats.totalCount.toLocaleString()}
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray-400 dark:text-gray-500">Today</span>
                <span className="font-semibold tabular-nums text-blue-600 dark:text-blue-400">{visitorStats.todayCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-gray-400 dark:text-gray-500">Yesterday</span>
                <span className="font-semibold tabular-nums text-gray-600 dark:text-gray-300">{visitorStats.yesterdayCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <StatusSidebar top={sidebarTop} />
    </div>
  );
}
