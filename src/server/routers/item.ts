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
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      try {
        const { name, note, image, categoryName } = input
        let categoryId: string = ""
        return await prisma.$transaction(async (tx) => {
          const checkCategory = await tx.category.findFirst({
            where: {
              name,
              User: {
                id: session.user.id,
              },
            },
          })
          if (checkCategory) {
            categoryId = checkCategory.id
          } else {
            const createCategory = await tx.category.create({
              data: {
                name: categoryName,
                User: {
                  connect: {
                    id: session?.user?.id,
                  },
                },
              },
            })
            categoryId = createCategory.id
          }

          const createdItem = await tx.item.create({
            data: {
              name,
              note,
              image,
              User: {
                connect: {
                  id: session.user.id,
                },
              },
              category: {
                connect: {
                  id: categoryId,
                },
              },
            },
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })

          return createdItem
        })
      } catch (err) {
        console.log(err)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }),

  all: protectedProcedure.query(({ ctx: { prisma, session } }) => {
    try {
      const allItems = prisma.category.findMany({
        where: {
          User: {
            id: session.user.id,
          },
        },
        include: {
          items: true,
        },
      })
      return allItems
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
        cause: err,
      })
    }
  }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { prisma }, input: itemId }) => {
      try {
        const deleteItem = await prisma.item.delete({
          where: { id: itemId },
        })
        return deleteItem
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }),

  allCategories: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        const categories = await prisma.category.findMany({
          where: {
            User: {
              id: session.user.id,
            },
          },
          select: {
            name: true,
          },
        })

        return categories.map((c) => ({ value: c.name, label: c.name }))
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }
  ),
})

export default itemRouter
