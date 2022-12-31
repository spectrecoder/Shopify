import { z } from "zod"
import { publicProcedure, router } from "../trpc"
import itemRouter from "./item"
import listRouter from "./list"

export const appRouter = router({
  item: itemRouter,
  list: listRouter,
})

export type AppRouter = typeof appRouter
