import {
  Horizon,
  Networks,
  Operation,
  TransactionBuilder,
  BASE_FEE,
  Memo,
  Asset,
  Keypair
} from '@stellar/stellar-sdk'
import { 
  isConnected, 
  getAddress, 
  signTransaction 
} from '@stellar/freighter-api'

const HORIZON_URL = process.env.NEXT_PUBLIC_STELLAR_HORIZON 
  || 'https://horizon-testnet.stellar.org'
const NETWORK_PASSPHRASE = Networks.TESTNET
export const server = new Horizon.Server(HORIZON_URL)

// ── 1. WALLET SETUP ──────────────────────────────────────────

export async function isFreighterInstalled(): Promise<boolean> {
  const result = await isConnected();
  return !result.error && result.isConnected;
}

export async function isFreighterConnected(): Promise<boolean> {
  const result = await isConnected();
  return !result.error && result.isConnected;
}

export async function getFreighterNetwork(): Promise<string> {
  // Freighter v6+ manages network internally. 
  // We return TESTNET as it is the target for this portfolio.
  return 'TESTNET';
}

// ── 2. WALLET CONNECT / DISCONNECT ───────────────────────────

export async function connectFreighter(): Promise<{
  publicKey: string
  network: string
}> {
  const result = await isConnected();
  if (result.error || !result.isConnected) throw new Error('Freighter not installed');

  try {
    const { address } = await getAddress();
    if (!address) throw new Error('Could not get address from Freighter');
    return { publicKey: address, network: 'TESTNET' };
  } catch (error: any) {
    if (error.message?.includes('User rejected')) throw new Error('User rejected connection');
    throw error;
  }
}

export function disconnectWallet(): { success: boolean } {
  return { success: true };
}

// ── 3. BALANCE HANDLING ───────────────────────────────────────

export async function getXLMBalance(address: string): Promise<number> {
  try {
    const account = await server.loadAccount(address);
    const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
  } catch {
    return 0;
  }
}

export async function fundWithFriendbot(address: string): Promise<{
  success: boolean,
  message: string
}> {
  try {
    const response = await fetch(`https://friendbot.stellar.org?addr=${address}`);
    if (response.ok) return { success: true, message: 'Wallet funded with 10,000 XLM' };
    const data = await response.json();
    return { success: false, message: data.detail || 'Friendbot funding failed' };
  } catch {
    return { success: false, message: 'Network error funding wallet' };
  }
}

// ── 4. TRANSACTION FLOW ───────────────────────────────────────

export type SendXLMResult = 
  | {
      success: true
      txHash: string
      ledger: number
      timestamp: string
      amount: string
      destination: string
      fee: string
    }
  | {
      success: false
      error: string
      code?: string
    }

export async function sendXLM(params: {
  sourcePublicKey: string
  destinationAddress: string
  amountXLM: string
  memo?: string
}): Promise<SendXLMResult> {
  try {
    const sourceAccount = await server.loadAccount(params.sourcePublicKey);
    const builder = new TransactionBuilder(sourceAccount, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    }).addOperation(
      Operation.payment({
        destination: params.destinationAddress,
        asset: Asset.native(),
        amount: params.amountXLM,
      })
    );

    if (params.memo) builder.addMemo(Memo.text(params.memo));
    const transaction = builder.setTimeout(30).build();
    const xdr = transaction.toXDR();
    const signedTx = await signTransaction(xdr, { networkPassphrase: NETWORK_PASSPHRASE });
    const result = await server.submitTransaction(TransactionBuilder.fromXDR(signedTx.signedTxXdr, NETWORK_PASSPHRASE));

    return {
      success: true,
      txHash: result.hash,
      ledger: result.ledger,
      timestamp: new Date().toISOString(),
      amount: params.amountXLM,
      destination: params.destinationAddress,
      fee: (parseFloat(BASE_FEE) / 10000000).toString(),
    };
  } catch (error: any) {
    return {
      success: false,
      error: parseStellarError(error),
      code: error.response?.data?.extras?.result_codes?.transaction || 'error',
    };
  }
}

export function validateStellarAddress(address: string): {
  valid: boolean,
  error?: string
} {
  try {
    Keypair.fromPublicKey(address);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid Stellar address format' };
  }
}

export async function getTransactionByHash(txHash: string): Promise<{
  txHash: string
  ledger: number
  createdAt: string
  sourceAccount: string
  fee: string
  memo?: string
  successful: boolean
} | null> {
  try {
    const tx = await server.transactions().transaction(txHash).call();
    return {
      txHash: tx.hash,
      ledger: tx.ledger_attr,
      createdAt: tx.created_at,
      sourceAccount: tx.source_account,
      fee: (tx as any).fee_value || (tx as any).fee_charged || "0",
      memo: tx.memo,
      successful: tx.successful,
    };
  } catch {
    return null;
  }
}

export function parseStellarError(error: any): string {
  const resultCodes = error.response?.data?.extras?.result_codes;
  const mainCode = resultCodes?.transaction;
  const opCode = resultCodes?.operations?.[0];

  const errorMap: Record<string, string> = {
    'op_underfunded': 'Insufficient XLM balance for this transaction',
    'op_no_destination': 'Destination wallet does not exist on Stellar yet',
    'tx_bad_seq': 'Transaction sequence error. Please try again.',
    'op_low_reserve': 'Your wallet needs more XLM to meet the minimum reserve',
    'tx_insufficient_fee': 'Transaction fee too low. Please try again.',
  }

  if (error.message === 'User rejected') return 'Transaction rejected in Freighter';
  return errorMap[opCode] || errorMap[mainCode] || error.message || 'An unexpected Stellar error occurred';
}

// ── 5. ADVANCED INTEGRATION (COLLECTORS & VOTES) ───────────

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.POLL_ENCRYPTION_KEY || 'default-key-32-chars-long-!!!';
const ALGORITHM = 'aes-256-gcm';

export function generateCollectorKeypair() {
  const kp = Keypair.random();
  return {
    publicKey: kp.publicKey(),
    secretKey: kp.secret()
  };
}

export function encryptSecret(secret: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decryptSecret(encryptedData: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function getTransactionDetail(txHash: string) {
  return getTransactionByHash(txHash);
}

export async function getVotesFromHorizon(collectorWallet: string, options: any[]) {
  try {
    const transactions = await server.transactions().forAccount(collectorWallet).limit(200).order('desc').call();
    const votes = transactions.records.filter(tx => tx.successful && tx.memo_type === 'text');
    
    // Tally results
    const tally = options.map(opt => ({
      ...opt,
      votes: votes.filter(v => (v.memo || '').trim() === (opt.memo || '').trim()).length
    }));

    return {
      tally,
      totalVotes: votes.length,
      votes: votes.map(v => ({
        txHash: v.hash,
        voterWallet: v.source_account,
        optionMemo: v.memo,
        createdAt: v.created_at
      }))
    };
  } catch (error) {
    console.error('getVotesFromHorizon error:', error);
    return { tally: options.map(o => ({ ...o, votes: 0 })), totalVotes: 0, votes: [] };
  }
}

export async function checkHasVoted(collectorWallet: string, voterWallet: string): Promise<boolean> {
  try {
    const transactions = await server.transactions()
      .forAccount(collectorWallet)
      .limit(200)
      .order('desc')
      .call();
    
    return transactions.records.some(
      tx => tx.successful && tx.source_account === voterWallet
    );
  } catch {
    return false;
  }
}
