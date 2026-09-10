import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiUrl = process.env.PHP_API_URL;
  if (!apiUrl) return NextResponse.json({ error: "PHP_API_URL is not configured" }, { status: 503 });
  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(await request.json()),
      cache: "no-store",
    });
    const body = await response.text();
    const headers = new Headers({ "content-type": "application/json" });
    const cookie = response.headers.get("set-cookie");
    if (cookie) headers.set("set-cookie", cookie);
    return new NextResponse(body, { status: response.status, headers });
  } catch {
    return NextResponse.json({ error: "PHP API is unavailable" }, { status: 502 });
  }
}
