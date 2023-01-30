import { nanoid } from "nanoid";
import { MutationCreateTimetableArgs } from "~types/graphql";
import { AppContext } from "~types/index";

export default {
  Mutation: {
    createTimetable(
      _parent: unknown,
      { input }: MutationCreateTimetableArgs,
      context: AppContext
    ) {
      const { prismaClient, currentUser } = context;

      const { title, description, events } = input;

      return prismaClient.timetable.create({
        data: {
          title,
          description,
          code: nanoid(10),
          owner: {
            connect: {
              id: currentUser!.id!,
            },
          },
          events: {
            createMany: {
              data: events.map((event) => {
                const {
                  title: eventTitle,
                  description,
                  startDate,
                  startTime,
                  repeat,
                  endTime,
                } = event!;

                return {
                  title: eventTitle,
                  description,
                  startDate,
                  startTime,
                  endTime,
                  repeat,
                  ownerId: currentUser!.id!,
                };
              }),
            },
          },
        },
      });
    },
  },
};
