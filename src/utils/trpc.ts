import { httpBatchLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import SuperJSON from "superjson"
import type { AppRouter } from "../server/routers/_app"

function getBaseUrl() {
  if (typeof window !== "undefined") return

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    if (typeof window !== "undefined") {
      return {
        transformer: SuperJSON,
        links: [
          httpBatchLink({
            url: `/api/trpc`,
          }),
        ],
      }
    }
    return {
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              const { connection: _connection, ...headers } = ctx.req.headers
              return {
                ...headers,
                "x-ssr": "1",
              }
            }
            return {}
          },
        }),
      ],
    }
  },
  ssr: true,
})
