import { OAuth2Client } from "google-auth-library";
import { INVALID_TOKEN_ERROR } from "~constants/errors";
import { MISSING_NAME_AND_EMAIL } from "~constants/responseCodes";
import type { UserPayload } from "~types";
import AuthenticationError from "~utils/errors/AuthenticationError";

export default async function verifyGoogleCode(
  code: string
): Promise<UserPayload> {
  const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: "postmessage",
  });

  try {
    const ticket = await client.verifyIdToken({
      idToken: code,
    });

    const payload = ticket.getPayload();

    if (!(payload?.given_name && payload?.email)) {
      throw new AuthenticationError(MISSING_NAME_AND_EMAIL);
    }

    return {
      firstName: payload.given_name!,
      lastName: payload.family_name!,
      email: payload.email!,
      emailVerified: !!payload.email_verified,
      pictureUrl: payload.picture,
    };
  } catch (e) {
    throw new AuthenticationError(INVALID_TOKEN_ERROR, e as Error);
  }
}
