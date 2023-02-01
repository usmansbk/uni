import { QueryGetTimetableByIdArgs } from "~types/graphql";
import { AppContext } from "~types/index";

export default {
  Query: {
    async getTimetableById(
      parent: unknown,
      { id }: QueryGetTimetableByIdArgs,
      context: AppContext
    ) {
      const { prismaClient } = context;

      return prismaClient.timetable.findUnique({
        where: {
          id,
        },
      });
    },
  },
};
