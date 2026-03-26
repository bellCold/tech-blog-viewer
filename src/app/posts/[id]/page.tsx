"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BlogPostDetail, fetchPost } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost(Number(id))
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-4">
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
                style={{ width: `${80 + Math.random() * 20}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-400 dark:text-gray-500">
          글을 찾을 수 없습니다
        </h1>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          ← 목록으로
        </button>

        {/* Header */}
        <header className="mb-8 border-b border-gray-100 pb-8 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
              {post.source.name}
            </span>
            {post.tags?.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                <svg className="h-3 w-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-400 dark:text-gray-500">
            {post.author && <span>{post.author}</span>}
            {post.publishedAt && (
              <>
                <span>·</span>
                <span>{formatDate(post.publishedAt)}</span>
              </>
            )}
          </div>
        </header>

        {/* AI Summary */}
        {post.summary && (
          <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950/50">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <span>AI 요약</span>
            </div>
            <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-200">
              {post.summary}
            </p>
          </div>
        )}

        {/* Original Link */}
        <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">원문 보기</p>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            {post.source.name}에서 읽기 →
          </a>
        </div>
      </div>
    </div>
  );
}
