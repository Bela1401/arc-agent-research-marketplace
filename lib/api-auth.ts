import { NextResponse } from "next/server";

const AUTH_HEADER = "x-arc-admin-token";
const AUTH_QUERY_PARAM = "token";

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

function readQueryToken(request: Request): string | null {
  const url = new URL(request.url);
  return url.searchParams.get(AUTH_QUERY_PARAM)?.trim() ?? null;
}

export function requireArcAdminToken(
  request: Request,
  options?: { allowQueryParam?: boolean }
): NextResponse | null {
  const configuredToken = process.env.ARC_ADMIN_API_TOKEN;

  if (!configuredToken) {
    return NextResponse.json(
      {
        error:
          "ARC admin API token is not configured. Set ARC_ADMIN_API_TOKEN before using Arc mutation routes."
      },
      { status: 503 }
    );
  }

  const providedToken =
    request.headers.get(AUTH_HEADER) ??
    readBearerToken(request) ??
    (options?.allowQueryParam ? readQueryToken(request) : null);

  if (!providedToken || providedToken !== configuredToken) {
    return NextResponse.json(
      {
        error: options?.allowQueryParam
          ? `Forbidden. Provide a valid ${AUTH_HEADER} header, Bearer token, or ${AUTH_QUERY_PARAM} query parameter.`
          : `Forbidden. Provide a valid ${AUTH_HEADER} header or Bearer token.`
      },
      { status: 403 }
    );
  }

  return null;
}
