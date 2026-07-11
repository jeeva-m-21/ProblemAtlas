import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getOrCreateUser(clerkId: string) {
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  });
  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Clerk session valid but currentUser() returned null");

  const [created] = await db
    .insert(users)
    .values({
      clerkId,
      name: clerkUser.fullName ?? clerkUser.username ?? "Anonymous",
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      avatarUrl: clerkUser.imageUrl ?? null,
      externalProfileType: null,
      externalProfileUrl: null,
      skills: null,
      domains: null,
      bio: null,
    })
    .returning();

  return created;
}
