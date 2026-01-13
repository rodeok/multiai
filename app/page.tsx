import Link from 'next/link';
import { FaGithub, FaGoogle, FaTwitter, FaCheck } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="font-bold text-lg tracking-tight">MultiAI</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-white transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Next Generation AI
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
                All Your Favorite<br />
                AI Models in <span className="text-blue-500">One Place</span>
              </h1>

              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Switch between GPT-4, Claude, and Gemini in a single interface.
                No more multiple subscriptions or browser tabs.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href="/auth/signin"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="#demo"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all hover:scale-105 active:scale-95"
                >
                  View Demo
                </Link>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-4 shadow-2xl">
                <div className="absolute -top-12 -right-12 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-xs font-mono flex items-center gap-2 text-blue-400 shadow-xl animate-bounce">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  GPT-4 Turbo
                </div>
                <div className="absolute -bottom-6 -left-6 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-xs font-mono flex items-center gap-2 text-purple-400 shadow-xl">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Claude 3.5
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-4 h-[300px] lg:h-[400px]">
                  {/* Sidebar Mockup */}
                  <div className="bg-slate-800/50 rounded-lg p-3 flex flex-col gap-3">
                    <div className="h-2 w-12 bg-slate-700 rounded mb-2" />
                    <div className="h-8 w-full bg-slate-700/50 rounded" />
                    <div className="h-8 w-full bg-slate-700/30 rounded" />
                    <div className="h-8 w-full bg-slate-700/30 rounded" />
                  </div>

                  {/* Content Mockup */}
                  <div className="bg-slate-800/50 rounded-lg p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-16 bg-blue-500/50 rounded" />
                      <div className="ml-auto flex gap-1">
                        <div className="w-2 h-2 rounded bg-red-500/50" />
                        <div className="w-2 h-2 rounded bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded bg-green-500/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-slate-700 rounded" />
                      <div className="h-2 w-1/2 bg-slate-700 rounded" />
                    </div>
                    <div className="mt-auto h-24 bg-slate-900/50 rounded border border-slate-700/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Engineered for Efficiency</h2>
            <p className="text-slate-400 text-lg">
              Experience the power of multi-model comparison and unified control in one seamless dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Split-View Comparison',
                desc: 'Compare outputs side-by-side in real-time to find the best response for your specific needs.',
                icon: (
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )
              },
              {
                title: 'Unified Interface',
                desc: 'One prompt, multiple results. Experience zero friction across all major LLMs with a single login.',
                icon: (
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )
              },
              {
                title: 'Powerful Analytics',
                desc: 'Track usage and token consumption across all models in one comprehensive visual dashboard.',
                icon: (
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">Choose the plan that fits your workflow. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col">
              <div className="mb-8">
                <h3 className="font-semibold text-slate-300 mb-2">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Basic access to standard models', '10 messages per day', 'Web access only'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <FaCheck className="w-3 h-3 text-green-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signin"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-center transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-blue-500 flex flex-col relative shadow-2xl shadow-blue-900/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="font-semibold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$20</span>
                  <span className="text-slate-500">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'Unlimited access to all models',
                  'Split-view comparison mode',
                  'Priority support & low latency',
                  'Unlimited chat history'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white">
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <FaCheck className="w-3 h-3 text-white" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signin"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-center transition-colors shadow-lg shadow-blue-600/25"
              >
                Go Pro
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col">
              <div className="mb-8">
                <h3 className="font-semibold text-slate-300 mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  'API integration & access',
                  'Dedicated account manager',
                  'Custom security (SSO/SAML)',
                  'Bulk seats & licensing'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <FaCheck className="w-3 h-3 text-green-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="mailto:sales@multiai.com"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-center transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-12 lg:p-16 text-center border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
            Ready to supercharge your<br />workflow?
          </h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">
            Join 10,000+ power users comparing AI models daily. Get started in minutes,
            no credit card required for the free tier.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/auth/signin"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Start Your Free Trial
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all hover:scale-105 active:scale-95"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm" />
            </div>
            <span className="font-bold tracking-tight">MultiAI</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          </div>

          <div className="text-sm text-slate-500">
            © 2024 MultiAI Platform Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}