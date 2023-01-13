import { GraphQLError } from "graphql";
import { BAD_REQUEST_ERROR } from "~constants/errors";

export default class QueryError extends GraphQLError {
  constructor(message: string, cause?: Error) {
    super(message, {
      extensions: {
        code: BAD_REQUEST_ERROR,
        http: {
          status: 400,
        },
      },
    });
    this.cause = cause;
  }
}
