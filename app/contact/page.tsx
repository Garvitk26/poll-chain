import { Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] py-20 px-4 md:px-8 bg-[#00080f]">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Get in Touch</h1>
          <p className="text-lg text-slate-400">We'd love to hear from you. Reach out for support or enterprise inquiries.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#000d1a] border border-rose-500/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#001224] transition-colors cursor-pointer group">
            <Mail className="w-10 h-10 text-rose-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-slate-200 mb-2">Email Support</h3>
            <p className="text-slate-400 text-sm mb-4">Guaranteed response within 24 hours.</p>
            <a href="mailto:hello@pollchain.app" className="text-rose-400 font-medium">hello@pollchain.app</a>
          </div>
          
          <div className="bg-[#000d1a] border border-violet-500/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#001224] transition-colors cursor-pointer group">
             <MessageSquare className="w-10 h-10 text-violet-400 mb-4 group-hover:scale-110 transition-transform" />
             <h3 className="text-xl font-bold text-slate-200 mb-2">Community Discord</h3>
             <p className="text-slate-400 text-sm mb-4">Chat directly with the engineering team.</p>
             <a href="#" className="text-violet-400 font-medium">Join Server</a>
          </div>
        </div>
      </div>
    </main>
  );
}
