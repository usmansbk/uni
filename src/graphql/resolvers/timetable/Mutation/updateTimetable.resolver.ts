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
          updateItems.map((event) => {
            const {
              id,
              title,
              description,
              startDate,
              startTime,
              endTime,
              repeat,
            } = event!;

            return transaction.event.update({
              where: {
                id: id!,
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
          })
        );
        return transaction.timetable.update({
          where: {
            id: authorizedTimetable.id,
          },
          data: {
            ...values,
            events: {
              createMany: {
                data: createItems.map((event) => {
                  const {
                    title,
                    description,
                    startDate,
                    startTime,
                    repeat,
                    endTime,
                  } = event!;

                  return {
                    title,
                    description,
                    startDate,
                    startTime,
                    repeat,
                    endTime,
                    ownerId: currentUser!.id!,
                  };
                }),
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
