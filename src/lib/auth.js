import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import getDb from './db';

export const authOptions = {
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const db = getDb();
        const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(credentials.email);
        if (!user) return null;
        const isValid = bcryptjs.compareSync(credentials.password, user.password_hash);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET || 'tavlen-solutions-secret-key-2024-change-in-production',
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
};
