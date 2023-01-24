import { MutationUpdateEventArgs } from "~types/graphql";
import { AppContext } from "~types/index";

export default {
  Mutation: {
    updateEvent(
      _parent: unknown,
      { input }: MutationUpdateEventArgs,
      context: AppContext
    ) {
      const { prismaClient } = context;

      const { id, title, startDate, startTime, endTime, description, repeat } =
        input;

      return prismaClient.event.update({
        where: {
          id: id!,
        },
        data: {
          title,
          startDate,
          startTime,
          endTime,
          description,
          repeat,
        },
      });
    },
  },
};
