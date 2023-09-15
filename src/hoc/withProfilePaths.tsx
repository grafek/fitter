import type { GetStaticPaths } from "next";
import { prisma } from "../server/db/client";

function withProfilePaths(): GetStaticPaths {
  return async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
      },
    });
    return {
      paths: users.map((user) => ({
        params: {
          profileId: user.id,
        },
      })),
      fallback: "blocking",
    };
  };
}

export default withProfilePaths;
