# PollChain — On-chain Transparent Voting

![CI](https://github.com/parth1241/pollchain/actions/workflows/ci.yml/badge.svg)
![Vercel](https://img.shields.io/badge/deployed-vercel-black)
![Stellar](https://img.shields.io/badge/blockchain-Stellar%20Testnet-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌐 Live Demo
**[YOUR_VERCEL_URL]**

> Built on **Stellar Testnet** — no real funds used.

## 📱 Screenshots

### Wallet Connected + Balance Display
> Screenshot of WalletStatusBar showing connected address + XLM balance.

### Successful Testnet Transaction
> Screenshot of TransactionSuccessCard after casting a vote.
> Shows: txHash, amount, wallet address, updated balance, Stellar Expert link.

### Mobile Responsive View
> Screenshot of the app on 375px mobile width.

### CI/CD Pipeline
> GitHub Actions tab showing green CI run.

---

## 📋 What It Does
PollChain is a decentralized voting platform that ensures every vote is immutable, transparent, and verifiable. By recording votes on the Stellar blockchain, PollChain eliminates concerns about election tampering and provides a public audit trail that anyone can verify. It supports weighted voting, proposal management, and real-time result tracking, making it ideal for DAOs, community governance, and corporate decision-making.

## ⚙️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router + TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| Blockchain | Stellar SDK + Soroban + Freighter Wallet |
| Database | MongoDB Atlas |
| Auth | NextAuth.js (JWT) |
| Deployment | Vercel |
| Network | Stellar Testnet |

## 🔗 Blockchain Details

### Network
- **Network:** Stellar Testnet
- **Horizon:** https://horizon-testnet.stellar.org
- **Soroban RPC:** https://soroban-testnet.stellar.org
- **Explorer:** https://stellar.expert/explorer/testnet

### Contract Details
- **Voting Contract ID:** [CONTRACT_ID]
- **Blockchain Network:** Stellar Testnet

### Asset / Token Details
- **Asset Code:** XLM (Native)
- **Explorer Link:** https://stellar.expert/explorer/testnet/asset/XLM

## 🚀 Setup Instructions (Run Locally)

### Prerequisites
- [ ] Node.js 18+
- [ ] MongoDB Atlas account
- [ ] Freighter wallet extension

### Step 1 — Clone Repository
```bash
git clone https://github.com/parth1241/pollchain.git
cd pollchain
```

### Step 2 — Install Dependencies
```bash
npm install
```

### Step 3 — Configure Environment Variables
```bash
cp .env.example .env.local
```

### Step 4 — Set Up MongoDB Atlas
1. Visit https://cloud.mongodb.com and create a free M0 cluster.
2. Add a database user and allow network access (0.0.0.0/0).
3. Copy the driver connection string into `MONGODB_URI` in `.env.local`.

### Step 5 — Set Up Freighter Wallet
1. Install Freighter and switch to **Testnet**.
2. Fund your wallet at https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY.

### Step 6 — Run Development Server
```bash
npm run dev
```

### Step 7 — Create Account + Connect Wallet
1. Visit http://localhost:3000/signup
2. After login, click "Connect Wallet" and approve in Freighter.

### Step 8 — Test a Transaction
1. Polls → Active Polls.
2. Select a proposal and cast your vote.
3. Click "Submit Vote to Blockchain".
4. Approve in Freighter → transaction confirmed and vote recorded on-chain.

## 📁 Project Structure
```
/app                 → Next.js App Router root
  /polls             → Poll browsing & creation
  /results           → Real-time analytics
  /api               → API routes for backend logic
/components
  /shared            → Blockchain-aware components
  /visuals           → Charts and result visuals
/lib
  stellar.ts         ← Core Stellar/Soroban SDK logic
  voting.ts          ← Smart contract interaction layer
```

## 🔒 Security
- Vote privacy: Only cryptographic proof of salt is recorded if needed.
- Client-side signing: No storage of private keys.
- Anti-sybil: Multi-factor authentication + wallet verification.

## 🌱 Deployment (Vercel)
1. Push to GitHub.
2. Import to Vercel and add environment variables.
3. Update `NEXTAUTH_URL` to your Vercel URL.

## 📝 Commit History
10+ meaningful commits following conventional format.

## 🏆 Hackathon
Built for the **Antigravity x Stellar Builder Track Belt Progression**.
- Level 1-4 Complete ✅

## 📄 License
MIT — see LICENSE file
