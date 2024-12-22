import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "./rate-limit";

export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  options = { limit: 60 }
) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const isAllowed = await rateLimit.check(ip, options.limit);

  if (!isAllowed) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  return handler();
}