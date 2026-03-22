const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const protectRoute = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

module.exports = { protectRoute };
