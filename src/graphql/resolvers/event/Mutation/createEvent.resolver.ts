import { MutationCreateEventArgs } from "~types/graphql";
import { AppContext } from "~types/index";

export default {
  Mutation: {
    createEvent(
      _parent: unknown,
      { input }: MutationCreateEventArgs,
      context: AppContext
    ) {
      const { prismaClient, currentUser } = context;

      const {
        title,
        timetableId,
        startDate,
        startTime,
        endTime,
        description,
        repeat,
      } = input;

      return prismaClient.event.create({
        data: {
          title,
          startDate,
          startTime,
          endTime,
          description,
          repeat,
          owner: {
            connect: {
              id: currentUser!.id!,
            },
          },
          timetable: timetableId
            ? {
                connect: {
                  id: timetableId,
                },
              }
            : undefined,
        },
      });
    },
  },
};
