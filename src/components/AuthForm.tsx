import { useState, FormEvent } from 'react';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (email: string, password: string) => void;
}

const AuthForm = ({ isLogin, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-base font-medium text-[var(--foreground)]">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full p-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] text-[var(--foreground)] text-base"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-base font-medium text-[var(--foreground)]">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full p-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] text-[var(--foreground)] text-base"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#F97316] text-white px-6 py-4 rounded-full font-medium hover:bg-[#EA580C] transition-all duration-300 text-base"
      >
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default AuthForm;