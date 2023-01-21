import { Event } from "@prisma/client";
import { AppContext } from "~types/index";

export default {
  Event: {
    isOwner(event: Event, args: never, context: AppContext) {
      return event.ownerId === context.currentUser?.id;
    },
    owner(event: Event, args: never, context: AppContext) {
      const { prismaClient } = context;
      return prismaClient.event
        .findUnique({
          where: {
            id: event.id,
          },
        })
        .owner();
    },
    timetable(event: Event, args: never, context: AppContext) {
      const { prismaClient } = context;
      return prismaClient.event
        .findUnique({
          where: {
            id: event.id,
          },
        })
        .timetable();
    },
  },
};
