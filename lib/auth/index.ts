import { auth } from "@clerk/nextjs/server";

export async function getAuthUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new AuthError("UNAUTHORIZED", "Sign in required", 401);
  }
  return userId;
}

export async function requireAdmin(): Promise<string> {
  const userId = await getAuthUserId();
  if (userId !== process.env.ADMIN_CLERK_USER_ID) {
    throw new AuthError("FORBIDDEN", "Admin access required", 403);
  }
  return userId;
}

export function assertOwnership(
  resourceOwnerClerkId: string,
  requestingClerkId: string
): void {
  if (resourceOwnerClerkId !== requestingClerkId) {
    throw new AuthError("FORBIDDEN", "You do not have permission to modify this resource", 403);
  }
}

export class AuthError extends Error {
  constructor(
    public code: "UNAUTHORIZED" | "FORBIDDEN",
    message: string,
    public status: 401 | 403
  ) {
    super(message);
    this.name = "AuthError";
  }
}
