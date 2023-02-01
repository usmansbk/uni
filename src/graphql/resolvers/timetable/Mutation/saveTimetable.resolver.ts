import { MutationSaveTimetableArgs } from "~types/graphql";
import { AppContext } from "~types/index";

export default {
  Mutation: {
    saveTimetable(
      parent: unknown,
      { id }: MutationSaveTimetableArgs,
      context: AppContext
    ) {
      const { prismaClient, currentUser } = context;

      return prismaClient.timetable.update({
        where: {
          id,
        },
        data: {
          saves: {
            create: {
              userId: currentUser!.id!,
            },
          },
        },
      });
    },
    unsaveTimetable(
      parent: unknown,
      { id }: MutationSaveTimetableArgs,
      context: AppContext
    ) {
      const { prismaClient, currentUser } = context;

      return prismaClient.timetable.update({
        where: {
          id,
        },
        data: {
          saves: {
            delete: {
              userId_timetableId: {
                userId: currentUser!.id!,
                timetableId: id,
              },
            },
          },
        },
      });
    },
  },
};
