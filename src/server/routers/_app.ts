import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import itemRouter from "./item"

export const appRouter = router({
  item: itemRouter,
})

export type AppRouter = typeof appRouter
