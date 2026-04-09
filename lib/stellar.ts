import { Horizon, Keypair, Operation, Asset, Memo, TransactionBuilder, Networks, Transaction } from '@stellar/stellar-sdk';
import crypto from 'crypto';
import { env } from './env';

export const server = new Horizon.Server(env.NEXT_PUBLIC_STELLAR_HORIZON);

const ALGORITHM = 'aes-256-cbc';

// Helper to get 32-byte key from whatever POLL_ENCRYPTION_KEY is provided
const getEncryptionKey = () => crypto.createHash('sha256').update(env.POLL_ENCRYPTION_KEY).digest();

export function encryptSecret(secret: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  let encrypted = cipher.update(secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptSecret(encrypted: string): string {
  const [ivHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function generateCollectorKeypair() {
  const kp = Keypair.random();
  return { publicKey: kp.publicKey(), secretKey: kp.secret() };
}

export async function fundWithFriendbot(publicKey: string) {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
    if (!response.ok) throw new Error('Friendbot funding failed');
    return { success: true };
  } catch (err: any) {
     return { success: false, error: err.message };
  }
}

export async function getVotesFromHorizon(collectorWallet: string, options: any[]) {
  try {
    const page = await server.payments()
      .forAccount(collectorWallet)
      .order('desc')
      .limit(200)
      .call();

    const payments = page.records as any[]; // the sdk returns objects mapping to Horizon API
    
    // Convert to tallies
    let totalVotes = 0;
    const tallyParams: Record<string, number> = {};
    options.forEach(opt => tallyParams[opt.memo] = 0);
    
    const validPayments = [];

    for (const payment of payments) {
      if (payment.type === 'payment' && payment.asset_type === 'native') {
        const tx = await payment.transaction();
        const memo = tx.memo;
        if (memo && typeof memo === 'string' && Object.prototype.hasOwnProperty.call(tallyParams, memo)) {
          tallyParams[memo] += 1;
          totalVotes += 1;
          validPayments.push({
            txHash: payment.transaction_hash,
            voterWallet: payment.from,
            amount: parseFloat(payment.amount),
            createdAt: payment.created_at,
            memo: memo
          });
        }
      }
    }

    const tally = options.map(opt => ({
      ...opt,
      count: tallyParams[opt.memo] || 0
    }));

    return { tally, totalVotes, payments: validPayments };
  } catch (error) {
    console.error('Error fetching votes', error);
    return { tally: [], totalVotes: 0, payments: [] };
  }
}

export async function checkHasVoted(collectorWallet: string, voterWallet: string): Promise<boolean> {
  try {
    const page = await server.payments()
      .forAccount(collectorWallet)
      .order('desc')
      .limit(100)
      .call();

    // Check if voterWallet sent to collectorWallet
    const payments = page.records as any[];
    return payments.some((p: any) => p.type === 'payment' && p.from === voterWallet);
  } catch (e) {
    return false;
  }
}

export async function getTransactionDetail(txHash: string) {
  try {
    const tx: any = await server.transactions().transaction(txHash).call();
    return {
      txHash: tx.hash,
      memo: tx.memo,
      sourceAccount: tx.source_account,
      createdAt: new Date(tx.created_at),
      operationCount: tx.operation_count,
    };
  } catch (e) {
    return null;
  }
}

// Client-compatible freighter params stub structure
export function buildVoteTxParams(voterWallet: string, collectorWallet: string, optionMemo: string) {
  return {
    collectorWallet,
    optionMemo,
    amount: "0.0000100",
    network: 'TESTNET'
  };
}
