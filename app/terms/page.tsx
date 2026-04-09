export default function TermsPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] py-16 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-3xl mx-auto prose prose-invert prose-p:text-slate-400 prose-headings:text-slate-200">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: October 2024</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By using PollChain, you agree to these terms. If you disagree, do not use the service. PollChain provides an interface bridging web browsers to the Stellar network.</p>
        
        <h2>2. Decentralized Liability</h2>
        <p>PollChain acts solely as a relayer of cryptographic intents to the Stellar Horizon nodes. We cannot reverse, modify, or censor transactions once they are signed by your wallet and accepted by the network validators. We are not liable for lost keys or misdirected funds.</p>
        
        <h2>3. Appropriate Use</h2>
        <p>You agree not to use the platform to orchestrate illegal activities, spam the ledger with automated dust transactions, or attempt to overwhelm the API rate limits.</p>
        
        <h2>4. Modifications</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes agreement to the updated terms.</p>
      </div>
    </main>
  );
}
