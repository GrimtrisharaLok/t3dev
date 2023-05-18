import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { userFilterClient } from "@/server/helpers/filterUserClient";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.userId),
        limit: 100,
      })
    ).map(userFilterClient);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.userId);

      if (!author || !author.username)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found.",
        });
      return {
        post,
        author: {
          ...author,
          username: author.username,
        },
      };
    });
  }),

  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId;

      const posts = await ctx.prisma.post.findMany({
        take: 100,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId,
        },
      });

      const users = [await clerkClient.users.getUser(userId)].map(
        userFilterClient
      );

      return posts.map((post) => {
        const author = users.find((user) => user.id === post.userId);

        if (!author || !author.username)
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Author not found",
          });

        return {
          post,
          author: {
            ...author,
            username: author.username,
          },
        };
      });
    }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const { success } = await ratelimit.limit(userId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          userId,
        },
      });

      return post;
    }),
});
