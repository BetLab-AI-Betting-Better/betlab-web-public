"use server";

import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, updateTag } from "next/cache";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

type RevalidatePayload = {
  tag?: string;
  strategy?: "revalidate" | "update";
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RevalidatePayload;
    const tag = body.tag?.trim();

    if (!tag) {
      return NextResponse.json({ error: "Missing cache tag" }, { status: 400 });
    }

    if (body.strategy === "update") {
      updateTag(tag);
    } else {
      revalidateTag(tag);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Cache revalidation error:", error);
    return NextResponse.json({ error: "Unable to revalidate tag" }, { status: 500 });
  }
}
