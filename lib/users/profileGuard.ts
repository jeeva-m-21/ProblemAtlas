import type { users } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

export function assertProfileComplete(user: User): void {
  if (!user.externalProfileUrl || !user.skills?.length) {
    throw new ProfileIncompleteError();
  }
}

export class ProfileIncompleteError extends Error {
  public status = 422;
  public code = "PROFILE_INCOMPLETE" as const;

  constructor() {
    super("Complete your profile before creating a Solution Space.");
    this.name = "ProfileIncompleteError";
  }
}
