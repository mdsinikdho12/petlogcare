import { NextRequest, NextResponse } from "next/server";

const TARGET_BASE_URL = "https://petcarelog-api.lokmansarkar.com/api/v1";

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathString = Array.isArray(path) ? path.join("/") : path || "";
  const searchString = request.nextUrl.search || "";
  const targetUrl = `${TARGET_BASE_URL}/${pathString}${searchString}`;

  // Forward incoming headers, but explicitly set Host to the target domain
  // Nginx on the target requires Host: petcarelog-api.lokmansarkar.com (otherwise returns 404)
  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    // Skip hop-by-hop and client host headers
    if (
      lowerKey !== "host" &&
      lowerKey !== "content-length" &&
      lowerKey !== "connection" &&
      lowerKey !== "origin" &&
      lowerKey !== "referer"
    ) {
      forwardHeaders.set(key, value);
    }
  });

  // Explicit target host & origin
  forwardHeaders.set("host", "petcarelog-api.lokmansarkar.com");
  forwardHeaders.set("origin", "http://localhost:3000");

  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? request.body : undefined;

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
      // @ts-expect-error - duplex is required in Node.js runtime for streaming bodies
      duplex: hasBody ? "half" : undefined,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Forward all safe response headers
      if (lower !== "content-encoding" && lower !== "transfer-encoding") {
        responseHeaders.append(key, value);
      }
    });

    // Ensure CORS headers are open for the same-origin response
    responseHeaders.set("Access-Control-Allow-Credentials", "true");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[API Proxy Error] ${method} ${targetUrl}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to backend service",
        error: error.message,
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const HEAD = proxyRequest;
export const OPTIONS = proxyRequest;
