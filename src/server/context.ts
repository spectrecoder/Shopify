import { inferAsyncReturnType } from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../pages/api/auth/[...nextauth]"
import prisma from "../../prisma/prismadb"
import { Session } from "next-auth"
import { Prisma, PrismaClient } from "@prisma/client"

interface CreateInnerContextOptions {
  session: Session | null
}

export async function createContextInner(opts: CreateInnerContextOptions) {
  return {
    prisma,
    session: opts.session,
  }
}

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  const session = await unstable_getServerSession(req, res, authOptions)

  const contextInner = await createContextInner({ session })

  return contextInner
}

// export type Context = inferAsyncReturnType<typeof createContext>
export type Context = inferAsyncReturnType<typeof createContextInner>
