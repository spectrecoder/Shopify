import * as trpcNext from "@trpc/server/adapters/next"
import { appRouter } from "../../../server/routers/_app"
import { createContext } from "../../../server/context"

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("Something went wrong", error)
    }
  },
})
