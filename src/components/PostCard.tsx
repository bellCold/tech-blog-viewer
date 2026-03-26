"use client";

import Link from "next/link";
import { BlogPostListItem } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { getTagColor } from "@/components/TagFilter";

const SOURCE_COLORS: Record<string, string> = {
  "카카오 기술블로그": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "네이버 D2": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "우아한형제들": "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "토스": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "LINE Engineering": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "카카오페이": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "쿠팡 엔지니어링": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  "당근 테크블로그": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "야놀자": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "데브시스터즈": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "뱅크샐러드": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

export default function PostCard({ post }: { post: BlogPostListItem }) {
  const badgeColor =
    SOURCE_COLORS[post.sourceName] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}
          >
            {post.sourceName}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {timeAgo(post.publishedAt)}
          </span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors dark:text-gray-100">
          {post.title}
        </h2>
        {post.summary && (
          <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-3 dark:text-gray-400">
            {post.summary}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          {post.author && <span className="text-xs text-gray-400 dark:text-gray-500">{post.author}</span>}
          <div className="flex flex-wrap justify-end gap-1.5">
            {post.tags?.map((tag) => (
              <span key={tag} className={`rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide ${getTagColor(tag)}`}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
