import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { id: 1, name: 'Crispy Burger Wraps', location: 'Bun Cafe', price: '69 EKM', image: '/items/image.png' },
  { id: 2, name: 'Fried Chicken', location: 'Derwaza Lounge', price: '80 EKM', image: '/items/image.png' },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#FFF7ED] text-[#1F2937] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Cravings Logo" width={30} height={30} className="mr-2" />
          <h1 className="text-xl font-bold text-[#1F2937]">Cravings</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/login">
            <button className="bg-[#F97316] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#EA580C] transition">
              Sign In
            </button>
          </Link>
          <button>
            <svg className="w-6 h-6 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Explore Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1F2937]">Explore Delicious Foods</h2>
          <select className="border border-[#E5E7EB] rounded-lg px-2 py-1 text-sm text-[#1F2937] bg-white">
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
            className="w-full p-3 pl-10 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] text-[#1F2937] bg-white"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Food Cards */}
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link href={`/item/${item.id}`} key={item.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-lg font-semibold text-[#1F2937]">{item.name}</h3>
                  <p className="text-sm text-[#1F2937] opacity-70">{item.location}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[#F97316] font-bold">{item.price}</p>
                    <button className="bg-[#EF4444] text-white px-3 py-1 rounded-full text-xs hover:bg-[#DC2626] transition">
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
      <footer className="bg-white shadow-t p-4 flex justify-around items-center">
        <button className="flex flex-col items-center text-[#F97316]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs mt-1">Explore</span>
        </button>
        <button className="flex flex-col items-center text-[#1F2937]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
          <span className="text-xs mt-1">Offers</span>
        </button>
      </footer>
    </div>
  );
};

export default HomePage;