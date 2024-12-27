import { NextRequest, NextResponse } from "next/server";
import { PostService } from "./service";
import { formatResponseError } from "@/utils/api";

export async function POST(request: NextRequest) {
  try {
    const registerService = new PostService.Register({
      client: {
        body: await request.json(),
      },
    });

    const { response, status } = await registerService.run();

    return NextResponse.json(response, { status });

  } catch (err) {
    return formatResponseError(err);
  }
}
