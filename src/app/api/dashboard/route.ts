import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiUrl = process.env.PHP_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: "PHP_API_URL is not configured" }, { status: 503 });
  }

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/dashboard.php`, {
      headers: {
        Accept: "application/json",
        ...(request.headers.get("cookie") ? { Cookie: request.headers.get("cookie") as string } : {}),
      },
      cache: "no-store",
    });
    const body = await response.text();
    const headers = new Headers({ "content-type": "application/json" });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) headers.set("set-cookie", setCookie);
    return new NextResponse(body, { status: response.status, headers });
  } catch {
    return NextResponse.json({ error: "PHP API is unavailable" }, { status: 502 });
  }
}