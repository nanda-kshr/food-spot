"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';
import Image from 'next/image';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginType, setLoginType] = useState<'user' | 'partner'>('user');
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    try {
      if (isLogin) {
        await signIn(email, password);
        // Redirect based on login type
        if (loginType === 'partner') {
          router.push('/partner');
        } else {
          router.push('/');
        }
      } else {
        await signUp(email, password);
        router.push('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Royal Breeze Logo" width={48} height={48} className="mr-3" />
          <h1 className="text-2xl font-bold">Royal Breeze</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
          {/* Login Type Selection */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setLoginType('user')}
              className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                loginType === 'user' ? 'bg-[#F97316] text-white' : 'bg-white text-[var(--foreground)] border border-[#E5E7EB] hover:bg-[#F97316] hover:text-white'
              }`}
            >
              User Login
            </button>
            <button
              onClick={() => setLoginType('partner')}
              className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                loginType === 'partner' ? 'bg-[#F97316] text-white' : 'bg-white text-[var(--foreground)] border border-[#E5E7EB] hover:bg-[#F97316] hover:text-white'
              }`}
            >
              Partner Login
            </button>
          </div>

          {/* Form Title and Form */}
          <h2 className="text-3xl font-semibold text-[var(--foreground)] mb-6 text-center">
            {loginType === 'partner' ? 'Partner Login' : 'User Login'}
          </h2>
          <AuthForm isLogin={isLogin} onSubmit={handleSubmit} />
          <p className="mt-6 text-center text-[var(--foreground)] opacity-70">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#F97316] hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;