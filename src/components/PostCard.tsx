"use client";

import Link from "next/link";
import { BlogPostListItem } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { getTagColor } from "@/components/TagFilter";

const SOURCE_COLORS: Record<string, string> = {
  "카카오 기술블로그": "bg-yellow-100 text-yellow-800",
  "네이버 D2": "bg-green-100 text-green-800",
  "우아한형제들": "bg-sky-100 text-sky-800",
  "토스": "bg-blue-100 text-blue-800",
  "LINE Engineering": "bg-emerald-100 text-emerald-800",
  "카카오페이": "bg-amber-100 text-amber-800",
  "쿠팡 엔지니어링": "bg-rose-100 text-rose-800",
  "당근 테크블로그": "bg-orange-100 text-orange-800",
  "야놀자": "bg-pink-100 text-pink-800",
  "데브시스터즈": "bg-purple-100 text-purple-800",
  "뱅크샐러드": "bg-teal-100 text-teal-800",
};

export default function PostCard({ post }: { post: BlogPostListItem }) {
  const badgeColor =
    SOURCE_COLORS[post.sourceName] || "bg-gray-100 text-gray-800";

  return (
    <Link href={`/posts/${post.id}`}>
      <article className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}
          >
            {post.sourceName}
          </span>
          <span className="text-xs text-gray-400">
            {timeAgo(post.publishedAt)}
          </span>
        </div>
        <h2 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        {post.summary && (
          <p className="mb-4 text-sm leading-relaxed text-gray-500 line-clamp-3">
            {post.summary}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          {post.author && <span className="text-xs text-gray-400">{post.author}</span>}
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
