import { NextResponse } from "next/server";

const AUTH_HEADER = "x-arc-admin-token";

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export function requireArcAdminToken(request: Request): NextResponse | null {
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

  const providedToken = request.headers.get(AUTH_HEADER) ?? readBearerToken(request);

  if (!providedToken || providedToken !== configuredToken) {
    return NextResponse.json(
      {
        error: `Forbidden. Provide a valid ${AUTH_HEADER} header or Bearer token.`
      },
      { status: 403 }
    );
  }

  return null;
}
