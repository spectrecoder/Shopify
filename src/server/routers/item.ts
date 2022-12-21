import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure, router } from "../trpc"

const itemRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        note: z.string().optional(),
        image: z.string(),
        categoryName: z.string(),
      })
    )
    .mutation(async ({ input, ctx: { prisma } }) => {
      try {
        const { name, note, image, categoryName } = input
        const createdItem = await prisma.item.create({
          data: {
            name,
            note,
            image,
            category: {
              connectOrCreate: {
                where: {
                  name: categoryName,
                },
                create: {
                  name: categoryName,
                },
              },
            },
          },
          include: {
            category: true,
          },
        })

        return createdItem
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }),
})

export default itemRouter
