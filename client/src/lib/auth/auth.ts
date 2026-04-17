import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authService } from "../api/auth/auth-service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const { employee, accessToken, expiresIn } =
          await authService.login(credentials);
        return { ...employee, accessToken, expiresIn };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.avatarUrl = user.avatarUrl;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.status = user.status;
        // token.accessTokenExpiredAt =
        //   Date.now() + ((user.expiredIn ?? 0) - 3) * 1000;
      }

      // if (
      //   token.accessTokenExpiredAt &&
      //   Date.now() > token.accessTokenExpiredAt
      // ) {
      //   return null;
      // }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub!;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.avatarUrl = token.avatarUrl;
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.status = token.status;

      return session;
    },
  },
});
