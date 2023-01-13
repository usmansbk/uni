import { Request, Response, NextFunction } from "express";
import { AUTHENTICATION_ERROR } from "~constants/errors";
import AuthenticationError from "~utils/errors/AuthenticationError";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { context } = req;

  const { currentUser, t } = context;

  if (!currentUser) {
    return next(new AuthenticationError(t(AUTHENTICATION_ERROR)));
  }
  return next();
};

export default authMiddleware;
