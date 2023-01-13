import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure, router } from "../trpc"

const listItemRouter = router({
  updateQuantity: protectedProcedure
    .input(z.object({ itemID: z.string(), qty: z.number() }))
    .mutation(async ({ input: { itemID, qty }, ctx: { prisma } }) => {
      try {
        const updateQuantity = await prisma.listItem.update({
          where: {
            id: itemID,
          },
          data: {
            quantity: qty,
          },
        })
        return { itemID: updateQuantity.id, qty: updateQuantity.quantity }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }),
  updateDone: protectedProcedure
    .input(
      z.object({ trueIDs: z.string().array(), falseIDs: z.string().array() })
    )
    .mutation(async ({ input: { trueIDs, falseIDs }, ctx: { prisma } }) => {
      function updateIsDoneStatus(ids: string[], status: boolean) {
        return prisma.listItem.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            isDone: status,
          },
        })
      }
      try {
        await Promise.all([
          updateIsDoneStatus(trueIDs, true),
          updateIsDoneStatus(falseIDs, false),
        ])
        return { trueIDs, falseIDs }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }),
})

export default listItemRouter
