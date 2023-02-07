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

      const { id, title, description, startDate, startTime, endTime, repeat } =
        input;

      const authorizedEvent = await prismaClient.event.findFirst({
        where: {
          id: id!,
          owner: {
            id: currentUser?.id,
          },
        },
      });

      if (!authorizedEvent) {
        throw new QueryError(t(AUTHORIZATION_ERROR));
      }

      return prismaClient.event.update({
        where: {
          id: authorizedEvent.id,
        },
        data: {
          title,
          description,
          startDate,
          startTime,
          endTime,
          repeat,
        },
      });
    },
  },
};
