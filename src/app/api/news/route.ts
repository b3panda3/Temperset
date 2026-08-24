// News proxy — fetches GDELT articles per category with mock fallback.

import { NextRequest, NextResponse } from "next/server";
import { fetchCategoryNews } from "@/lib/news";
import { getCategory } from "@/lib/categories";

export const runtime = "nodejs";
export const revalidate = 1800; // 30-min cache

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category");
  if (!categoryId) {
    return NextResponse.json({ error: "category required" }, { status: 400 });
  }
  const cat = getCategory(categoryId);
  if (!cat) {
    return NextResponse.json({ error: "unknown category" }, { status: 400 });
  }
  const news = await fetchCategoryNews(cat.newsQuery, cat.id);
  return NextResponse.json({ items: news, category: cat.id });
}
