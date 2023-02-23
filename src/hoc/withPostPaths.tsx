import type { GetStaticPaths } from "next";
import { prisma } from "../server/db/client";

function withPostPaths(): GetStaticPaths {
  return async () => {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
      },
    });

    return {
      paths: posts.map((post) => ({
        params: {
          postId: post.id,
        },
      })),
      fallback: "blocking",
    };
  };
}

export default withPostPaths;
