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
  topListItems: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        return await prisma.$transaction(async (tx) => {
          const groupItems = await tx.listItem.groupBy({
            by: ["itemID"],
            where: {
              item: {
                userId: session.user.id,
              },
              list: {
                status: "COMPLETED",
              },
            },
            _sum: {
              quantity: true,
            },
            orderBy: {
              _sum: {
                quantity: "desc",
              },
            },
            take: 3,
          })

          if (!groupItems.length) return null

          const {
            _sum: { quantity: totalQuantities },
          } = await tx.listItem.aggregate({
            where: {
              item: {
                userId: session.user.id,
              },
              list: {
                status: "COMPLETED",
              },
            },
            _sum: {
              quantity: true,
            },
          })

          const items = await tx.item.findMany({
            where: {
              userId: session.user.id,
              id: {
                in: groupItems.map((i) => i.itemID),
              },
            },
            select: {
              id: true,
              name: true,
            },
          })

          const percentages: { [key: string]: number } = {}

          groupItems.forEach((g) => {
            percentages[g.itemID] =
              ((g._sum.quantity as number) / (totalQuantities as number)) * 100
          })

          return items
            .map((i) => ({ ...i, percentage: percentages[i.id] }))
            .sort((a, b) => b.percentage - a.percentage)
        })
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }
  ),
  topCategories: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        const topCategories = await prisma.category.aggregateRaw({
          pipeline: [
            {
              $lookup: {
                from: "Item",
                let: {
                  catID: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$categoryId", "$$catID"] },
                    },
                  },
                  {
                    $lookup: {
                      from: "ListItem",
                      let: {
                        itmID: "$_id",
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: { $eq: ["$itemID", "$$itmID"] },
                          },
                        },
                        {
                          $group: {
                            _id: "$itemID",
                            total: { $sum: "$quantity" },
                          },
                        },
                      ],
                      as: "listItems",
                    },
                  },
                  {
                    $set: {
                      listItem: { $first: "$listItems" },
                    },
                  },
                  {
                    $group: {
                      _id: "$categoryId",
                      totalQty: { $sum: "$listItem.total" },
                    },
                  },
                ],
                as: "items",
              },
            },
            {
              $set: {
                totalItemsBought: { $first: "$items" },
              },
            },
            {
              $project: {
                totalItems: { $ifNull: ["$totalItemsBought.totalQty", 0] },
              },
            },
            {
              $sort: { totalItems: -1 },
            },
            {
              $limit: 3,
            },
          ],
        })
        return topCategories
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred, please try again later.",
          cause: err,
        })
      }
    }
  ),
  monthlyChart: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      try {
        // const result = await prisma.list.aggregateRaw({
        //   pipeline: [
        //     {
        //       $lookup: {
        //         from: "ListItem",
        //         localField: "id",
        //         foreignField: "listItems",
        //         as: "listItem",
        //       },
        //     },
        //     // {
        //     //   $match: {
        //     //     $expr: {
        //     //       $eq: [session.user.id, { $getField: "$list.userId.$oid" }],
        //     //     },
        //     //   },
        //     // },
        //     {
        //       $match: {
        //         "$list.userId": { $eq: session.user.id },
        //       },
        //     },
        //     // {
        //     //   $unwind: "$list",
        //     // },
        //     // {
        //     //   $group: {
        //     //     _id: {
        //     //       year: { $year: "$list.createdAt" },
        //     //       month: { $month: "$list.createdAt" },
        //     //     },
        //     //     total: { $sum: "$quantity" },
        //     //   },
        //     // },
        //     // {
        //     //   $limit: 6,
        //     // },
        //     // {
        //     //   $sort: { "_id.year": 1, "_id.month": 1 },
        //     // },
        //   ],
        // })
        // return result
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

export default listItemRouter
