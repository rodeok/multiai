'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid credentials');
        } else {
          router.push('/workspace');
        }
      } else {
        // Register
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });
          if (!result?.error) {
            router.push('/workspace');
          }
        } else {
          const data = await response.json();
          setError(data.error);
        }
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/workspace' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col lg:flex-row">
      {/* Left Side - Hero (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-start p-12 text-white">
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl font-bold">MultiModel AI</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
            ✨ NEXT-GEN INTELLIGENCE
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Master Every <span className="text-blue-400">Model.</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Access GPT-4, Claude 3.5, and Llama 3 in one unified workspace.
            Compare responses side-by-side and optimize your workflow.
          </p>

          {/* Visualization */}
          <div className="relative w-96 h-64 border border-slate-700 rounded-lg bg-slate-800/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20"></div>
            <div className="absolute inset-4">
              <div className="flex justify-between items-end h-full">
                <div className="flex flex-col justify-end gap-2">
                  <div className="text-xs text-blue-400 font-mono">CLAUDE 3.5</div>
                  <div className="w-16 h-2 bg-blue-500 rounded"></div>
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <div className="text-xs text-purple-400 font-mono">GPT-4O</div>
                  <div className="w-16 h-3 bg-purple-500 rounded"></div>
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <div className="text-xs text-cyan-400 font-mono">LLAMA 3</div>
                  <div className="w-16 h-4 bg-cyan-500 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Branding (Only visible on small screens) */}
      <div className="lg:hidden p-8 pb-0 text-white text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold">MultiModel AI</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Master Every Model.</h1>
        <p className="text-gray-400 text-sm">Unified intelligence at your fingertips.</p>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-96 bg-slate-800/50 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-slate-700 flex flex-col justify-center p-8 mt-8 lg:mt-0">
        <div className="mb-8">
          <div className="flex gap-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isLogin
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!isLogin
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Enter your credentials to access your multi-model dashboard.</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuthSignIn('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-md text-white transition-colors"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuthSignIn('github')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-md text-white transition-colors"
          >
            <FaGithub />
            Continue with GitHub
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-slate-600"></div>
          <span className="text-gray-400 text-sm">OR EMAIL LOGIN</span>
          <div className="flex-1 h-px bg-slate-600"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-white">
                Password
              </label>
              {isLogin && (
                <Link href="#" className="text-blue-400 text-sm hover:underline">
                  Forgot?
                </Link>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-6">
          By continuing, you agree to our{' '}
          <Link href="#" className="text-blue-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            © 2024 MultiModel AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}