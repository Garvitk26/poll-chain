import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4 bg-[#00080f]">
      <h1 className="text-9xl font-bold text-rose-500/20 mb-4 animate-[bounce_2s_infinite]">404</h1>
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Consensus Not Reached</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        The route you are looking for has been dropped from the ledger or never existed.
      </p>
      <Link href="/" className="btn-primary py-2 px-6">
        Back home
      </Link>
    </div>
  );
}
