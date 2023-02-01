import { QueryGetEventByIdArgs } from "~types/graphql";
import { AppContext } from "~types/index";

export default {
  Query: {
    async getEventById(
      parent: unknown,
      { id }: QueryGetEventByIdArgs,
      context: AppContext
    ) {
      const { prismaClient } = context;

      return prismaClient.event.findUnique({
        where: {
          id,
        },
      });
    },
  },
};
