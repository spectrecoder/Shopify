import { protectedProcedure, router } from "../trpc"
import { z } from "zod"
import { TRPCError } from "@trpc/server"

const listInclude = {
  listItems: {
    select: {
      item: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
      id: true,
      quantity: true,
      isDone: true,
    },
  },
}

const listRouter = router({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        itemID: z.object({ id: z.string() }),
        listID: z.string().optional(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { listID, itemID } }) => {
        try {
          const upsertList = await prisma.list.upsert({
            where: {
              id: listID || "62ee8fa9837792d2c87e0ff9",
            },
            update: {
              listItems: {
                create: {
                  item: {
                    connect: itemID,
                  },
                },
              },
            },
            create: {
              user: {
                connect: { id: session.user.id },
              },
              listItems: {
                create: {
                  item: {
                    connect: itemID,
                  },
                },
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
          userId: session.user.id,
          status: "ONGOING",
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

  removeItem: protectedProcedure
    .input(z.object({ itemID: z.string(), listID: z.string() }))
    .mutation(async ({ input: { itemID, listID }, ctx: { prisma } }) => {
      try {
        const removeItem = await prisma.list.update({
          where: {
            id: listID,
          },
          data: {
            listItems: {
              delete: {
                id: itemID,
              },
            },
          },
          include: listInclude,
        })

        return removeItem
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }),
  updateListName: protectedProcedure
    .input(z.object({ listName: z.string(), listID: z.string() }))
    .mutation(async ({ input: { listName, listID }, ctx: { prisma } }) => {
      try {
        const updateName = await prisma.list.update({
          where: {
            id: listID,
          },
          data: {
            listName,
          },
          include: listInclude,
        })
        return updateName
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }),
  listStatus: protectedProcedure
    .input(
      z.object({
        listID: z.string(),
        status: z.enum(["COMPLETED", "CANCELLED"]),
      })
    )
    .mutation(async ({ input: { listID, status }, ctx: { prisma } }) => {
      try {
        const newList = await prisma.list.update({
          where: {
            id: listID,
          },
          data: {
            status,
            listItems: {
              updateMany: {
                where: {},
                data: {
                  isDone: status === "COMPLETED" ? true : false,
                },
              },
            },
          },
        })
        return newList
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }),
  allLists: protectedProcedure.query(async ({ ctx: { session, prisma } }) => {
    try {
      const userLists = await prisma.list.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      return userLists
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred, please try again later.",
        cause: err,
      })
    }
  }),
  singleList: protectedProcedure
    .input(z.string())
    .query(async ({ input: listID, ctx: { prisma, session } }) => {
      if (listID.length >= 25) return null
      try {
        const userList = await prisma.list.findFirst({
          where: {
            id: listID,
            userId: session.user.id,
          },
          include: {
            listItems: {
              select: {
                item: {
                  select: {
                    id: true,
                    name: true,
                    note: true,
                    image: true,
                    category: true,
                  },
                },
                id: true,
                quantity: true,
                isDone: true,
              },
            },
          },
        })
        return userList
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
