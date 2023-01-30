import { AUTHORIZATION_ERROR } from "~constants/errors";
import { MutationUpdateEventArgs } from "~types/graphql";
import { AppContext } from "~types/index";
import QueryError from "~utils/errors/QueryError";

export default {
  Mutation: {
    async updateEvent(
      _parent: unknown,
      { input }: MutationUpdateEventArgs,
      context: AppContext
    ) {
      const { prismaClient, currentUser, t } = context;

      const authorizedEvent = await prismaClient.event.findFirst({
        where: {
          id: input.id!,
          owner: {
            id: currentUser?.id,
          },
        },
      });

      if (!authorizedEvent) {
        throw new QueryError(t(AUTHORIZATION_ERROR));
      }

      const { title, startDate, startTime, endTime, description, repeat } =
        input;

      return prismaClient.event.update({
        where: {
          id: authorizedEvent.id,
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
