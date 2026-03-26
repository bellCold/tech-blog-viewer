import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  try {
    const res = await fetch(`${backendUrl}/api/sources`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    return NextResponse.json({
      status: res.ok ? "alive" : "error",
      statusCode: res.status,
    });
  } catch {
    return NextResponse.json({ status: "unreachable" }, { status: 503 });
  }
}
