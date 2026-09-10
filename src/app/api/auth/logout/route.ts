import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiUrl = process.env.PHP_API_URL;
  if (!apiUrl) return NextResponse.json({ ok: true });
  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/logout.php`, {
      method: "POST",
      headers: { Accept: "application/json", ...(request.headers.get("cookie") ? { Cookie: request.headers.get("cookie") as string } : {}) },
      cache: "no-store",
    });
    const body = await response.text();
    const headers = new Headers({ "content-type": "application/json" });
    const cookie = response.headers.get("set-cookie");
    if (cookie) headers.set("set-cookie", cookie);
    return new NextResponse(body, { status: response.status, headers });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
