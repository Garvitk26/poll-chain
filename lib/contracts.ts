import { invokeContract, nativeToScVal, scValToNative } from './stellar';

// These would be replaced with actual contract IDs after deployment
export const VOTING_CONTRACT_ID = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ID || 'CC...VOTING';
export const TOKEN_CONTRACT_ID = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ID || 'CC...TOKEN';

export async function createPollOnChain(params: {
  creator: string;
  title: string;
  options: string[];
}) {
  return invokeContract({
    contractId: VOTING_CONTRACT_ID,
    method: 'create_poll',
    args: [
      nativeToScVal(params.creator, { type: 'address' }),
      nativeToScVal(params.title),
      nativeToScVal(params.options),
    ],
    sourcePublicKey: params.creator,
  });
}

export async function castVoteOnChain(params: {
  voter: string;
  pollId: number;
  optionIdx: number;
}) {
  return invokeContract({
    contractId: VOTING_CONTRACT_ID,
    method: 'vote',
    args: [
      nativeToScVal(params.voter, { type: 'address' }),
      nativeToScVal(params.pollId, { type: 'u32' }),
      nativeToScVal(params.optionIdx, { type: 'u32' }),
    ],
    sourcePublicKey: params.voter,
  });
}

export async function claimTokens(userAddress: string) {
  return invokeContract({
    contractId: TOKEN_CONTRACT_ID,
    method: 'mint',
    args: [
      nativeToScVal(userAddress, { type: 'address' }),
      nativeToScVal(10, { type: 'i128' }), // Mint 10 tokens for testing
    ],
    sourcePublicKey: userAddress,
  });
}
