import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Lazy load Mongoose models to avoid Edge runtime issues
async function getUserModel() {
  const { default: User } = await import('@/models/User');
  return User;
}

async function getSubscriptionModel() {
  const { default: Subscription } = await import('@/models/Subscription');
  return Subscription;
}

async function connectDB() {
  const connect = (await import('./mongodb')).default;
  return connect();
}

// Function to get providers array (lazy evaluation)
function getProviders() {
  const providers: any[] = [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        await connectDB();
        const User = await getUserModel();
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await user.comparePassword(credentials.password as string);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ];

  // Add OAuth providers if configured
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  return providers;
}

export const authOptions = {
  providers: getProviders(),
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'credentials') {
        return true;
      }

      // Handle OAuth providers
      await connectDB();
      const User = await getUserModel();
      const Subscription = await getSubscriptionModel();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create new user and free subscription
        const newUser = await User.create({
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: new Date(),
        });

        await Subscription.create({
          userId: newUser._id,
          tier: 'free',
          status: 'active',
        });
      }

      return true;
    },
    async jwt({ token, user, account }: any) {
      // Initial sign in - set user ID from database
      if (user) {
        try {
          await connectDB();
          const User = await getUserModel();
          
          // For OAuth providers, fetch user by email to get database ID
          if (account?.provider !== 'credentials' && user.email) {
            const dbUser = await User.findOne({ email: user.email });
            if (dbUser) {
              token.id = dbUser._id.toString();
            } else {
              // Fallback to user.id if database user not found
              token.id = user.id;
            }
          } else {
            // For credentials provider, use the user.id directly
            token.id = user.id;
          }
        } catch (error) {
          console.error('Error fetching user in jwt callback:', error);
          token.id = user.id;
        }
      }

      if (account) {
        token.accessToken = account.access_token;
      }

      // Fetch user subscription (only if we have a valid token.id)
      if (token.id && typeof token.id === 'string') {
        try {
          await connectDB();
          const User = await getUserModel();
          const Subscription = await getSubscriptionModel();
          const dbUser = await User.findById(token.id);
          if (dbUser) {
            const subscription = await Subscription.findOne({ userId: dbUser._id });
            token.subscriptionTier = subscription?.tier || 'free';
            token.subscriptionStatus = subscription?.status || 'active';
          }
        } catch (error) {
          // If database query fails, use defaults
          console.error('Error fetching subscription:', error);
          token.subscriptionTier = 'free';
          token.subscriptionStatus = 'active';
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscriptionTier = token.subscriptionTier as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // After sign in, redirect to dashboard
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};

// Export handlers for Next.js 15 route handlers
export const { handlers } = NextAuth(authOptions);

