import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { prisma } from "../db/client";
import { getServerAuthSession } from "../../pages/api/auth/[...nextauth]";

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts?: CreateContextOptions) => {
  return {
    session: opts?.session,
    prisma,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
