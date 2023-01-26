import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { ChartData, TopCategories } from "../../types/types"
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
              $match: {
                $expr: { $eq: ["$userId", { $toObjectId: session.user.id }] },
              },
            },
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
                            isDone: true,
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
              $set: {
                totalItems: { $ifNull: ["$totalItemsBought.totalQty", 0] },
              },
            },
            {
              $sort: { totalItems: -1 },
            },
            {
              $limit: 3,
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$totalItems" },
                categories: {
                  $push: { name: "$name", totalItems: "$totalItems" },
                },
              },
            },
            {
              $project: {
                _id: "$$REMOVE",
                result: {
                  $map: {
                    input: "$categories",
                    as: "category",
                    in: {
                      name: "$$category.name",
                      percentage: {
                        $multiply: [
                          { $divide: ["$$category.totalItems", "$total"] },
                          100,
                        ],
                      },
                    },
                  },
                },
              },
            },
          ],
        })
        return topCategories as unknown as TopCategories[]
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
        const chartData = await prisma.list.aggregateRaw({
          pipeline: [
            {
              $match: {
                status: "COMPLETED",
                $expr: { $eq: ["$userId", { $toObjectId: session.user.id }] },
              },
            },
            {
              $lookup: {
                from: "ListItem",
                let: {
                  lID: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$listID", "$$lID"] },
                    },
                  },
                  {
                    $group: {
                      _id: "$listID",
                      totalQty: { $sum: "$quantity" },
                    },
                  },
                ],
                as: "listItems",
              },
            },
            {
              $set: {
                listItemsQty: { $first: "$listItems" },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                totalItems: { $sum: "$listItemsQty.totalQty" },
              },
            },
            {
              $sort: {
                "_id.year": 1,
                "_id.month": 1,
              },
            },
            {
              $limit: 6,
            },
          ],
        })

        return chartData as unknown as ChartData[]
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
