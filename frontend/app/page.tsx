import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Shield, Zap, Sparkles, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-bounce">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Version 1.0 is Live</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9]">
            The Elite <span className="text-indigo-600">Dev</span> Marketplace.
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-slate-500 font-medium mb-12 leading-relaxed">
            Hire world-class developers or sell your technical expertise.
            Secure sessions, real-time chat, and guaranteed delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/gigs">
              <Button size="lg" className="h-16 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-indigo-200">
                Explore Gigs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="h-16 px-10 text-lg font-black rounded-2xl border-2 border-slate-200">
                Become a Freelancer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale">
          <p className="text-xl font-black tracking-tighter">TECHSTARS</p>
          <p className="text-xl font-black tracking-tighter">DEV.TO</p>
          <p className="text-xl font-black tracking-tighter">GITHUB</p>
          <p className="text-xl font-black tracking-tighter">VERCEL</p>
          <p className="text-xl font-black tracking-tighter">STACKOVERFLOW</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Why DevMarket?</h2>
            <p className="text-4xl font-black text-slate-900 tracking-tight">Built for serious developers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Safe Payments", desc: "Escrow-like system ensures you get paid for every line of code.", icon: Shield },
              { title: "Real-time Chat", desc: "Seamless communication with built-in WebSocket messaging.", icon: Code },
              { title: "Fast Delivery", desc: "Automated tracking for project milestones and final delivery.", icon: Zap },
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials/Trust */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-3xl font-medium leading-relaxed max-w-3xl mx-auto italic">
            "DevMarket changed how I find contract work. The community is high-quality and the payment verification system is flawless."
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-800" />
            <div className="text-left">
              <p className="font-bold">Alex Simmons</p>
              <p className="text-slate-500 text-sm">Fullstack Developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-indigo-600 rounded-[48px] p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <h2 className="text-4xl font-black mb-8">Ready to start your next project?</h2>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="h-16 px-12 text-lg font-black bg-white text-indigo-600 hover:bg-indigo-50">
                Join the Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-slate-400">© 2026 DevMarket. All code reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Twitter</Link>
            <Link href="#" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">LinkedIn</Link>
            <Link href="#" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
