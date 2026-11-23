import { NextRequest, NextResponse } from "next/server";

const TARGET_BASE_URL = "https://petcarelog-api.lokmansarkar.com/api/v1";

async function proxyRootRequest(request: NextRequest) {
  const searchString = request.nextUrl.search || "";
  const targetUrl = `${TARGET_BASE_URL}${searchString}`;

  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
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
      if (lower !== "content-encoding" && lower !== "transfer-encoding") {
        responseHeaders.append(key, value);
      }
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
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

export const GET = proxyRootRequest;
export const POST = proxyRootRequest;
export const PUT = proxyRootRequest;
export const PATCH = proxyRootRequest;
export const DELETE = proxyRootRequest;
export const HEAD = proxyRootRequest;
export const OPTIONS = proxyRootRequest;
