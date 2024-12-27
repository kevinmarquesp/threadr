import { ZodError } from "zod";
import { LibsqlError } from "@libsql/client";
import { NextResponse } from "next/server";

/** Meant to be used in the app/api/vX route files, to inform the client. */
function formatResponseError(err: unknown) {
  if (err instanceof SyntaxError)
    return NextResponse.json(
      { info: "Syntax error", error: err }, { status: 400 });

  if (err instanceof ZodError)
    return NextResponse.json(
      { info: "Invalid request data validation", error: err }, { status: 400 });

  if (err instanceof LibsqlError)
    return NextResponse.json(
      { info: err.message ?? "Database query error", error: err }, { status: 500 });

  return NextResponse.json({
    info: err instanceof Object && "message" in err ?
      err.message : "Unexpected error",
    error: err,
  }, { status: 500 });
}

export { formatResponseError };
