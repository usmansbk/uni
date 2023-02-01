import { Timetable } from "@prisma/client";
import { AppContext } from "~types/index";

export default {
  Timetable: {
    async isSaved(timetable: Timetable, args: never, context: AppContext) {
      const { currentUser, prismaClient } = context;

      if (!currentUser || currentUser.id === timetable.ownerId) {
        return false;
      }

      const saved = await prismaClient.timetable
        .findUnique({
          where: {
            id: timetable.id,
          },
        })
        .saves({
          where: {
            user: {
              id: currentUser.id,
            },
          },
        });

      return !!saved?.length;
    },
    isOwner(timetable: Timetable, args: never, context: AppContext) {
      return timetable.ownerId === context.currentUser?.id;
    },
    owner(timetable: Timetable, args: never, context: AppContext) {
      const { prismaClient } = context;
      return prismaClient.timetable
        .findUnique({
          where: {
            id: timetable.id,
          },
        })
        .owner();
    },
    events(timetable: Timetable, args: never, context: AppContext) {
      const { prismaClient } = context;
      return prismaClient.timetable
        .findUnique({
          where: {
            id: timetable.id,
          },
        })
        .events({
          orderBy: [{ startDate: "asc" }, { title: "asc" }],
        });
    },
  },
};
