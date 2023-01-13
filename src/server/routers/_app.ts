import { router } from "../trpc"
import itemRouter from "./item"
import listRouter from "./list"
import listItemRouter from "./listItem"

export const appRouter = router({
  item: itemRouter,
  list: listRouter,
  listItem: listItemRouter,
})

export type AppRouter = typeof appRouter
