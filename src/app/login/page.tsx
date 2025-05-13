"use client";
import { Suspense, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiMail, FiLock, FiChevronRight, FiArrowRight, FiX } from 'react-icons/fi';
import { signIn, signOut } from '@/utils/firebaseAuth';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const currentDate = '2025-05-10 18:33:37'; // Using the provided date


  // Replace your existing useEffect with this
useEffect(() => {
  // This will run once when the component mounts
  if (user && user.uid) {
    signOut()
      .then(() => {
        console.log("User signed out when visiting login page");
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
        setError("Error signing out previous session");
      });
  }
}, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      if (user && user?.uid) {
        router.push(`/qrcode/${user.uid}`);
      } else {
      setError('Failed to sign in. Please contact the admin.');
      }
    } catch {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex">
      {/* Left side decorative panel (hidden on mobile) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
        
        .font-decorative {
          font-family: 'Pacifico', cursive;
        }
      `}</style>
      
      

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-amber-400 p-12 relative">
        <div className="flex flex-col justify-between h-full relative z-10">
          <div>
            <div className="flex items-center mb-8">
              <Image src="/circle.png" alt="Food Spot Logo" width={48} height={48} className="mr-3" />
              <h1 className="text-3xl font-decorative text-white">Food Spot</h1>
            </div>
            <h2 className="text-4xl font-bold  text-white mb-6">Discover the best food near you</h2>
            <p className="text-white text-lg opacity-90">
              Login to access your favorite restaurants, special deals, and personalized recommendations.
            </p>
          </div>
          
          <div className="self-start space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-2">
                <FiChevronRight className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-medium">Easy ordering process</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-2">
                <FiChevronRight className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-medium">Personalized recommendations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full p-2">
                <FiChevronRight className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-medium">Special discounts for members</p>
            </div>
          </div>

          {/* Current date display */}
          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm rounded-md px-3 py-2 text-white text-sm">
            {currentDate}
          </div>

          {/* Decorative food elements */}
          <div className="absolute right-0 top-20 opacity-20">
            <div className="rounded-full w-32 h-32 border-8 border-white"></div>
          </div>
          <div className="absolute right-20 bottom-20 opacity-20">
            <div className="rounded-full w-24 h-24 border-8 border-white"></div>
          </div>
          <div className="absolute left-10 bottom-40 opacity-20">
            <div className="rounded-full w-16 h-16 border-8 border-white"></div>
          </div>
        </div>
      </div>

      {/* Right side login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Image src="/circle.png" alt="Food Spot Logo" width={40} height={40} className="mr-2" />
            <h1 className="text-2xl font-decorative text-orange-500">Food Spot</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8">Please enter your details to sign in</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowForgotPasswordPopup(true)}
                    className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  {!isLoading && <FiArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>

          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Food Spot. All rights reserved.
          </div>
        </div>
      </div>

      {/* Forgot Password Popup */}
      {showForgotPasswordPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full relative animate-fadeIn">
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowForgotPasswordPopup(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-4">
              <div className="bg-orange-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FiMail className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Password Reset</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              For password resets, please contact the system administrator 
            </p>
            
            
            <button
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-all"
              onClick={() => setShowForgotPasswordPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add global animation for the popup */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
    </Suspense>
  );
};

export default LoginPage;