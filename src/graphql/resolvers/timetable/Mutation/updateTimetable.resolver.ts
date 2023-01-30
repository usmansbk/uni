import { AUTHORIZATION_ERROR } from "~constants/errors";
import { MutationUpdateTimetableArgs } from "~types/graphql";
import { AppContext } from "~types/index";
import QueryError from "~utils/errors/QueryError";

export default {
  Mutation: {
    async updateTimetable(
      _parent: unknown,
      { input }: MutationUpdateTimetableArgs,
      context: AppContext
    ) {
      const { prismaClient, currentUser, t } = context;

      const { id, events, ...values } = input;

      const authorizedTimetable = await prismaClient.timetable.findFirst({
        where: {
          id: id!,
          owner: {
            id: currentUser?.id,
          },
        },
        include: {
          events: true,
        },
      });

      if (!authorizedTimetable) {
        throw new QueryError(t(AUTHORIZATION_ERROR));
      }

      const updateItems = events.filter((event) => !!event!.id);
      const createItems = events.filter((event) => !event!.id);
      const deleteItems = authorizedTimetable.events.filter(
        (event) => !events.find((e) => e!.id === event.id)
      );

      return prismaClient.$transaction(async (transaction) => {
        await Promise.all(
          updateItems.map((event) =>
            transaction.timetable.update({
              where: {
                id: event!.id!,
              },
              data: event as any,
            })
          )
        );
        return transaction.timetable.update({
          where: {
            id: authorizedTimetable.id,
          },
          data: {
            ...values,
            events: {
              createMany: {
                data: createItems.map((event) => ({
                  ownerId: currentUser?.id,
                  ...(event as any),
                })),
              },
              deleteMany: {
                id: {
                  in: deleteItems.map((e) => e.id),
                },
              },
            },
          },
        });
      });
    },
  },
};
