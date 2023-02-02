import type { User } from "@prisma/client";
import { AppContext } from "~types";
import fileUrl from "~utils/imageFileUrl";

export default {
  User: {
    fullName: (user: User) => [user.firstName, user.lastName].join(" ").trim(),
    isMe(user: User, args: never, context: AppContext): boolean {
      return user.id === context.currentUser!.id;
    },
    async picture(
      user: User,
      args: { width: number; height: number },
      context: AppContext
    ): Promise<string | null> {
      const { prismaClient } = context;
      const avatar = await prismaClient.user
        .findUnique({
          where: {
            id: user.id,
          },
        })
        .avatar();

      if (avatar) {
        return fileUrl(avatar, args);
      }

      return user.pictureUrl;
    },
    async timetables(user: User, _args: never, context: AppContext) {
      const { prismaClient } = context;

      return prismaClient.timetable.findMany({
        where: {
          OR: [
            {
              owner: {
                id: user.id,
              },
            },
            {
              saves: {
                some: {
                  user: {
                    id: user.id,
                  },
                },
              },
            },
          ],
        },
        orderBy: [{ title: "asc" }],
      });
    },
  },
};
