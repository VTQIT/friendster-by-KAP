import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";
import { verifyLocalToken } from "./lib/local-auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth authentication first (cookie-based)
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // OAuth auth failed, try local auth
  }

  // If no OAuth user, try local auth (x-auth-token header)
  if (!ctx.user) {
    try {
      const authHeader = opts.req.headers.get("x-auth-token");
      if (authHeader) {
        ctx.user = await verifyLocalToken(authHeader);
      }
    } catch {
      // Local auth failed too
    }
  }

  return ctx;
}
