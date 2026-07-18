import "dotenv/config";
import { db } from "./index";
import {
  users,
  problems,
  gaps,
  approaches,
  sources,
  comments,
  interest,
  solutionSpaces,
  solutionSpaceMembers,
  artifacts,
} from "./schema";
import { mockProfiles } from "@/data/mockProfiles";
import { mockProblems } from "@/data/mockProblems";
import { mockProblemDetails, getMockProblemDetail } from "@/data/mockProblemDetails";
import { mockSolutionSpaces } from "@/data/mockSolutionSpaces";
import { mockDiscussions } from "@/data/mockDiscussions";
import { eq, sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data in dependency order
  await db.delete(artifacts);
  await db.delete(solutionSpaceMembers);
  await db.delete(solutionSpaces);
  await db.delete(interest);
  await db.delete(comments);
  await db.delete(sources);
  await db.delete(approaches);
  await db.delete(gaps);
  await db.delete(problems);
  await db.delete(users);
  await sql`ALTER SEQUENCE problems_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE gaps_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE approaches_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE sources_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE comments_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE solution_spaces_id_seq RESTART WITH 1`;
  await sql`ALTER SEQUENCE artifacts_id_seq RESTART WITH 1`;

  const profileData = mockProfiles.map((p) => ({
    clerkId: p.id === "me" ? "user_2nX3fR8kLm9pQw" : `clerk_${p.id}`,
    name: p.name,
    email: `${p.id.replace(/-/g, ".")}@example.com`,
    avatarUrl: null,
    externalProfileType: undefined,
    externalProfileUrl: null,
    bio: p.bio,
    skills: p.interests,
    domains: p.domains,
    reputationScore: p.metrics.collaborationScore,
  }));

  const insertedUsers = await db.insert(users).values(profileData).returning();
  const userMap = new Map<string, typeof insertedUsers[0]>();
  for (let i = 0; i < mockProfiles.length; i++) {
    userMap.set(mockProfiles[i].id, insertedUsers[i]);
  }
  console.log(`  ✓ Inserted ${insertedUsers.length} users`);

  // 2. Problems
  const problemRecords = mockProblems.map((p) => {
    const detail = getMockProblemDetail(p.id);
    return {
      id: p.id,
      title: p.title,
      domain: p.domain,
      descriptionShort: p.summary,
      descriptionFull: detail?.summaryDetail.explanation.join("\n\n") ?? p.summary,
      importance: detail?.summaryDetail.whyItMatters.join("\n\n") ?? "",
      validationStatus: "published" as const,
      feasibilityScore: p.feasibilityScore,
      implementationScope: p.implementationScope,
      interestedCount: p.interestedCount,
      activeSolutionSpacesCount: p.activeSolutionSpacesCount,
      implementationDifficulty: detail?.implementationDifficulty ?? null,
      relatedDomains: detail?.relatedDomains ?? null,
      curatedBy: userMap.get("me")!.id,
      publishedAt: new Date(detail?.createdAt ?? "2026-01-01"),
    };
  });
  const insertedProblems = await db.insert(problems).values(problemRecords).returning();
  console.log(`  ✓ Inserted ${insertedProblems.length} problems`);

  // 3. Gaps, Approaches, Sources
  let gapCount = 0;
  let approachCount = 0;
  let sourceCount = 0;
  for (const detail of mockProblemDetails) {
    if (detail.researchGaps.length > 0) {
      await db.insert(gaps).values(
        detail.researchGaps.map((g) => ({
          problemId: detail.id,
          kind: g.kind,
          title: g.title,
          description: g.detail,
          sourceReference: null,
        }))
      );
      gapCount += detail.researchGaps.length;
    }
    if (detail.possibleDirections.length > 0) {
      await db.insert(approaches).values(
        detail.possibleDirections.map((d) => ({
          problemId: detail.id,
          title: d.title,
          summary: d.summary,
          description: d.summary,
          opportunities: d.opportunities,
          evaluation: d.evaluation,
          risks: d.risks ?? null,
          sourceReference: null,
        }))
      );
      approachCount += detail.possibleDirections.length;
    }
  }
  console.log(`  ✓ Inserted ${gapCount} gaps, ${approachCount} approaches`);

  // 4. Comments from discussions
  let commentCount = 0;
  for (const thread of mockDiscussions) {
    for (const c of thread.comments) {
      const author = mockProfiles.find((p) => p.name === c.author.name);
      const authorUser = author ? userMap.get(author.id) : userMap.get("me");
      await db.insert(comments).values({
        entityType: thread.entityType,
        entityId: thread.entityId,
        userId: authorUser?.id ?? userMap.get("me")!.id,
        body: c.body,
        parentId: null, // simplified
        createdAt: new Date(c.createdAt),
      });
      commentCount++;
    }
  }
  console.log(`  ✓ Inserted ${commentCount} comments`);

  // 5. Interest records
  let interestCount = 0;
  for (const profile of mockProfiles) {
    const userRecord = userMap.get(profile.id)!;
    for (const contrib of profile.contributedProblems) {
      await db
        .insert(interest)
        .values({
          problemId: contrib.problemId,
          userId: userRecord.id,
          message: contrib.note ?? null,
        })
        .onConflictDoNothing();
      interestCount++;
    }
  }
  console.log(`  ✓ Inserted ${interestCount} interest records`);

  // 6. Solution Spaces
  let spaceCount = 0;
  let memberCount = 0;
  let artifactCount = 0;
  for (const mockSpace of mockSolutionSpaces) {
    const creator = mockSpace.contributors[0];
    const creatorProfile = mockProfiles.find((p) => p.name === creator.name);
    const creatorUser = creatorProfile ? userMap.get(creatorProfile.id) : userMap.get("me")!;

    const [insertedSpace] = await db
      .insert(solutionSpaces)
      .values({
        id: mockSpace.id,
        problemId: mockSpace.problemId,
        creatorId: creatorUser.id,
        name: mockSpace.title,
        description: mockSpace.overview.direction,
        overview: {
          direction: mockSpace.overview.direction,
          hypothesis: mockSpace.overview.hypothesis,
          strategy: mockSpace.overview.strategy,
          goals: mockSpace.overview.goals,
        },
        progressState: mockSpace.progressState,
        status: "active" as const,
        createdAt: new Date(mockSpace.createdAt),
        updatedAt: new Date(mockSpace.activity.lastActiveAt),
      })
      .returning();
    spaceCount++;

    // Members
    for (const contributor of mockSpace.contributors) {
      const cp = mockProfiles.find((p) => p.name === contributor.name);
      const cu = cp ? userMap.get(cp.id) : null;
      if (cu) {
        await db.insert(solutionSpaceMembers).values({
          solutionSpaceId: insertedSpace.id,
          userId: cu.id,
          role: contributor === mockSpace.contributors[0] ? "owner" : "member",
          status: contributor.status === "active" ? "active" : "inactive",
        });
        memberCount++;
      }
    }

    // Artifacts
    if (mockSpace.artifacts.length > 0) {
      const typeMap: Record<string, string> = {
        "Architecture doc": "documentation",
        "Prototype": "prototype",
        "Research note": "documentation",
        "GitHub": "repository",
        "Dataset": "dataset",
        "Paper": "paper",
        "Link": "other",
      };
      const artifactRecords = mockSpace.artifacts.map((a) => ({
        solutionSpaceId: insertedSpace.id,
        url: a.href ?? "#",
        title: a.title,
        type: typeMap[a.type] ?? "other",
        description: a.description,
        status: a.status,
        createdAt: new Date(a.updatedAt),
      }));
      await db.insert(artifacts).values(artifactRecords);
      artifactCount += mockSpace.artifacts.length;
    }
  }
  console.log(`  ✓ Inserted ${spaceCount} solution spaces, ${memberCount} members, ${artifactCount} artifacts`);

  console.log("\nSeed complete!");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .then(() => process.exit(0));
