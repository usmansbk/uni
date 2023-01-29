import { AUTHORIZATION_ERROR } from "~constants/errors";
import { MutationDeleteTimetableArgs } from "~types/graphql";
import { AppContext } from "~types/index";
import QueryError from "~utils/errors/QueryError";

export default {
  Mutation: {
    async deleteTimetable(
      _parent: unknown,
      { id }: MutationDeleteTimetableArgs,
      context: AppContext
    ) {
      const { prismaClient, currentUser, t } = context;

      const authorizedTimeble = await prismaClient.timetable.findFirst({
        where: {
          id,
          owner: {
            id: currentUser?.id,
          },
        },
      });

      if (!authorizedTimeble) {
        throw new QueryError(t(AUTHORIZATION_ERROR));
      }

      return prismaClient.timetable.delete({
        where: {
          id: authorizedTimeble?.id,
        },
      });
    },
  },
};
