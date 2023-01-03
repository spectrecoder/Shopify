import { protectedProcedure, router } from "../trpc"
import { z } from "zod"
import { TRPCError } from "@trpc/server"

const listInclude = {
  items: {
    select: {
      id: true,
      name: true,
      category: true,
      quantity: true,
      isDone: true,
    },
  },
}

const listRouter = router({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        itemIDs: z.array(z.object({ id: z.string() })),
        listID: z.string().optional(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { listID, itemIDs } }) => {
        try {
          const upsertList = await prisma.list.upsert({
            where: {
              id: listID || "62ee8fa9837792d2c87e0ff9",
            },
            update: {
              items: {
                connect: itemIDs,
              },
            },
            create: {
              user: {
                connect: { id: session?.user?.id },
              },
              items: {
                connect: itemIDs[0],
              },
            },
            include: listInclude,
          })

          // console.log(upsertList)

          return upsertList
        } catch (err) {
          console.log(err)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred, please try again later.",
            cause: err,
          })
        }
      }
    ),

  read: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
    try {
      const list = await prisma.list.findFirst({
        where: {
          userId: session?.user?.id,
          isActive: true,
        },
        include: listInclude,
      })

      return list
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
        cause: err,
      })
    }
  }),
})

export default listRouter
