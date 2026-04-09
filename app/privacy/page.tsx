export default function PrivacyPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] py-16 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-3xl mx-auto prose prose-invert prose-p:text-slate-400 prose-headings:text-slate-200 prose-a:text-cyan-400">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: October 2024</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect minimal information to provide PollChain services. As a decentralized platform, we do not have access to your private cryptographic keys. We do store your profile email strictly for account recovery and notification purposes if you create an account.</p>
        
        <h2>2. Blockchain Data is Public</h2>
        <p>When you cast a vote via the Stellar network, that transaction (including the memo field containing your vote) is permanently recorded on the public ledger. Do not link personal identifiers to your Stellar wallets if you strictly require anonymity, as blockchain transactions can be analyzed.</p>
        
        <h2>3. Local Storage</h2>
        <p>We use standard HTTP cookies for NextAuth session management and LocalStorage for user UI preferences (e.g., Theme selections). We do not use tracking cookies for third-party advertisers.</p>
        
        <h2>4. Contact</h2>
        <p>For questions concerning data privacy, please email <a href="mailto:privacy@pollchain.app">privacy@pollchain.app</a>.</p>
      </div>
    </main>
  );
}
