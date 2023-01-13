import verifyGoogleCode from "src/services/google-oauth";
import {
  AppContext,
  SocialProvider,
  UpdateProfileInput,
  UserPayload,
} from "src/types";
import { INVALID_SOCIAL_PROVIDER } from "src/constants/responseCodes";
import AuthenticationError from "src/utils/errors/AuthenticationError";

export default {
  Mutation: {
    loginWithSocialProvider: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          code: string;
          provider: SocialProvider;
        };
      },
      context: AppContext
    ) => {
      const { provider, code } = input;
      const { prismaClient, jwt, t } = context;

      let payload: UserPayload;

      if (provider === "GOOGLE") {
        payload = await verifyGoogleCode(code);
      } else {
        throw new AuthenticationError(t(INVALID_SOCIAL_PROVIDER));
      }

      let user = await prismaClient.user.findFirst({
        where: {
          email: payload.email,
        },
      });

      if (!user) {
        const { email, firstName, lastName, emailVerified, pictureUrl } =
          payload;

        user = await prismaClient.user.create({
          data: {
            email,
            emailVerified,
            firstName,
            lastName,
            pictureUrl,
          },
        });
      }

      return {
        token: jwt.sign({ id: user.id }),
      };
    },
    updateProfile: (
      parent: unknown,
      { input }: { input: UpdateProfileInput },
      context: AppContext
    ) => {
      const { prismaClient, currentUser } = context;

      return prismaClient.user.update({
        where: {
          id: currentUser?.id,
        },
        data: input,
      });
    },
  },
};
