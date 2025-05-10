"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const menuItems = [
  { id: 1, name: 'Crispy Burger Wraps', location: 'Bun Cafe', price: '69 EKM', image: '/items/image.png' },
  { id: 2, name: 'Fried Chicken', location: 'Derwaza Lounge', price: '80 EKM', image: '/items/image.png' },
];

const HomePage = () => {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-[var(--card)] to-[var(--accent)] shadow-sm">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Cravings Logo" width={30} height={30} className="mr-2" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Cravings</h1>
        </div>
        <div className="flex items-center space-x-2">
          {user ? (
            <button 
              onClick={() => router.push('/profile')}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              Profile
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition">
                Sign In
              </button>
            </Link>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--muted)]">
            {theme === 'dark' ? (
              <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button>
            <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {/* Explore Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--foreground)]">Explore Delicious Foods</h2>
          <select className="w-full sm:w-auto border border-[var(--input)] rounded-lg px-2 py-1 text-sm text-[var(--foreground)] bg-[var(--background)]">
            <option>ALL Locations</option>
            <option>Bun Cafe</option>
            <option>Derwaza Lounge</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search Dishes or Hotels"
            className="w-full p-3 pl-10 border border-[var(--input)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] bg-[var(--background)]"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {menuItems.map((item) => (
            <Link href={`/item/${item.id}`} key={item.id}>
              <div className="bg-[var(--card)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative w-full h-48 sm:h-56 md:h-64">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{item.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.location}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[var(--primary)] font-bold">{item.price}</p>
                    <button className="bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-1 rounded-full text-xs hover:opacity-90 transition">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="bg-gradient-to-r from-[var(--card)] to-[var(--accent)] shadow-t p-4 md:p-6 flex justify-around items-center">
        <button className="flex flex-col items-center text-[var(--primary)]">
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs md:text-sm mt-1">Explore</span>
        </button>
        <button className="flex flex-col items-center text-[var(--foreground)]">
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
          <span className="text-xs md:text-sm mt-1">Offers</span>
        </button>
      </footer>
    </div>
  );
};

export default HomePage;