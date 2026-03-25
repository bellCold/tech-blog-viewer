const API_BASE = "/api";

export interface BlogSource {
  id: number;
  name: string;
  url: string;
  rssUrl: string | null;
  type: "RSS" | "CRAWL";
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostListItem {
  id: number;
  title: string;
  summary: string | null;
  url: string;
  author: string | null;
  sourceName: string;
  tags: string[];
  publishedAt: string | null;
}

export interface BlogPostDetail {
  id: number;
  title: string;
  content: string | null;
  summary: string | null;
  url: string;
  author: string | null;
  source: BlogSource;
  tags: string[];
  publishedAt: string | null;
  collectedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function fetchPosts(
  page = 0,
  size = 12,
  sourceId?: number,
  tag?: string
): Promise<PageResponse<BlogPostListItem>> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: "publishedAt,desc",
  });
  if (sourceId) params.set("sourceId", String(sourceId));
  if (tag) params.set("tag", tag);
  const res = await fetch(`${API_BASE}/posts?${params}`);
  return res.json();
}

export async function fetchTags(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/posts/tags`);
  return res.json();
}

export async function fetchPost(id: number): Promise<BlogPostDetail> {
  const res = await fetch(`${API_BASE}/posts/${id}`);
  return res.json();
}

export async function fetchSources(): Promise<BlogSource[]> {
  const res = await fetch(`${API_BASE}/sources`);
  return res.json();
}

export async function searchPosts(
  keyword: string,
  page = 0,
  size = 12
): Promise<PageResponse<BlogPostListItem>> {
  const params = new URLSearchParams({
    keyword,
    page: String(page),
    size: String(size),
    sort: "publishedAt,desc",
  });
  const res = await fetch(`${API_BASE}/posts/search?${params}`);
  return res.json();
}
