// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl }); // Debug logging

      try {
        // If the url is a relative path, use it with baseUrl
        if (url.startsWith("/")) {
          return `${baseUrl}${url}`;
        }

        // If the url is from the same origin, use it
        if (url.startsWith(baseUrl)) {
          return url;
        }

        // Default fallback to dashboard
        return `${baseUrl}/dashboard`;
      } catch (error) {
        console.error("Redirect error:", error);
        return `${baseUrl}/dashboard`;
      }
    },
    async signIn({ user, account }) {
      console.log("SignIn callback:", {
        user: user?.email,
        account: account?.provider,
      }); // Debug logging
      return true; // Allow sign in
    },
    async session({ session }) {
      console.log("Session callback:", { user: session?.user?.email }); // Debug logging
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export { handler as GET, handler as POST };
