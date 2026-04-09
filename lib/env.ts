export const env = {
  MONGODB_URI: process.env.MONGODB_URI as string,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET as string,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL as string,
  NEXT_PUBLIC_STELLAR_NETWORK: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
  NEXT_PUBLIC_STELLAR_HORIZON: process.env.NEXT_PUBLIC_STELLAR_HORIZON || 'https://horizon-testnet.stellar.org',
  POLL_ENCRYPTION_KEY: process.env.POLL_ENCRYPTION_KEY as string,
};

const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'POLL_ENCRYPTION_KEY'
] as const;

for (const envVar of requiredEnvVars) {
  if (!env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
