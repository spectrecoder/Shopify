import {
  TRPCError,
  initTRPC,
  inferRouterInputs,
  inferRouterOutputs,
} from "@trpc/server"
import SuperJSON from "superjson"
import { Context } from "./context"
import { AppRouter } from "./routers/_app"

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
})

const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    })
  }

  return next({
    ctx: {
      session: ctx.session,
    },
  })
})

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthenticated)
