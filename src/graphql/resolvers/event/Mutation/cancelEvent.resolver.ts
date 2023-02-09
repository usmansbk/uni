import { AUTHORIZATION_ERROR } from "~constants/errors";
import { AppContext } from "~types";
import { MutationCancelEventArgs } from "~types/graphql";
import QueryError from "~utils/errors/QueryError";

export default {
  Mutation: {
    async cancelEvent(
      _parent: unknown,
      { date, id }: MutationCancelEventArgs,
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

      return prismaClient.event.update({
        where: {
          id,
        },
        data: {
          isAllCancelled: !date,
          cancelledDates: date
            ? {
                push: date,
              }
            : undefined,
        },
      });
    },
  },
};
