import { AUTHORIZATION_ERROR } from "~constants/errors";
import { MutationDeleteEventArgs } from "~types/graphql";
import { AppContext } from "~types/index";
import QueryError from "~utils/errors/QueryError";

export default {
  Mutation: {
    async deleteEvent(
      _parent: unknown,
      { id }: MutationDeleteEventArgs,
      context: AppContext
    ) {
      const { prismaClient, currentUser, t } = context;

      const authorizedEvent = await prismaClient.event.findFirst({
        where: {
          id,
          owner: {
            id: currentUser?.id,
          },
        },
      });

      if (!authorizedEvent) {
        throw new QueryError(t(AUTHORIZATION_ERROR));
      }

      return prismaClient.event.delete({
        where: {
          id: authorizedEvent.id,
        },
      });
    },
  },
};
