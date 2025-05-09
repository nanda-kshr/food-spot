"use client";
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const mustTryItems = [
  { id: 1, name: 'Butter Jam Cheese Toast', price: 55, description: 'Toast with butter, jam and cheese', image: '/items/image.png' },
  { id: 2, name: 'Butter Chocolate Cheese Toast', price: 70, description: 'Toast with butter, chocolate and cheese', image: '/items/image.png' },
];

const categories = [
  'Fruit & Nuts', 'Sandwich', 'Burger', 'Bites', 'Burger Meal', 'Wraps',
  'Wraps Meal', 'Maggie', 'Pasta', 'Healthy', 'Fruit With Cream',
  'Special Ice Cream', 'Faloodas', 'Ice Cream Scoop', 'Fresh Fruit Salad',
  'Avil Mania', 'Ice Tea', 'Pure Juice', 'Mojitos', 'Fresh Juice', 'Milk Shake',
  'Soda', 'Lassi'
];

const items = [
  { id: 1, name: 'Butter Jam Cheese Toast', price: 55, description: 'Toast with butter, jam and cheese', image: '/items/image.png' },
  { id: 2, name: 'Butter Chocolate Cheese Toast', price: 70, description: 'Toast with butter, chocolate and cheese', image: '/items/image.png' },
  { id: 3, name: 'White Cheese Toast', price: 65, description: 'Toast with white chocolate and...', image: '/items/image.png' },
  { id: 4, name: 'Peanut Cheese Toast', price: 65, description: 'Toast with peanuts and cheese', image: '/items/image.png' },
  { id: 5, name: 'Chocolate Toast', price: 70, description: 'Chocolate toast', image: '/items/image.png' },
  { id: 6, name: 'Dry Fruit Cheese Toast', price: 65, description: 'Toast with dry fruits and cheese', image: '/items/image.png' },
  { id: 7, name: 'Peanut Fruit Cheese Toast', price: 85, description: 'Toast with peanuts, fruits and cheese', image: '/items/image.png' },
];

const QrCodePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Fruit & Nuts');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update total price and items
  const updateTotals = (newQuantities: { [key: number]: number }) => {
    let price = 0;
    let items = 0;
    Object.keys(newQuantities).forEach((id) => {
      const itemId = parseInt(id);
      const quantity = newQuantities[itemId];
      const item = [...mustTryItems, ...items].find((i) => i.id === itemId);
      if (item) {
        price += item.price * quantity;
        items += quantity;
      }
    });
    setTotalPrice(price);
    setTotalItems(items);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: number, delta: number) => {
    setQuantities((prev) => {
      const newQuantity = (prev[itemId] || 0) + delta;
      if (newQuantity < 0) return prev;
      const newQuantities = { ...prev, [itemId]: newQuantity };
      updateTotals(newQuantities);
      return newQuantities;
    });
  };

  // Automatic scrolling for Must Try section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % mustTryItems.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: nextIndex * (scrollRef.current.offsetWidth * 0.48),
            behavior: 'smooth',
          });
        }
        return nextIndex;
      });
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle manual scroll snapping
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth * 0.48;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
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
        <div className="flex items-center space-x-4">
          <button>
            <svg className="w-7 h-7 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
          <button>
            <div className="w-10 h-10 bg-[#F97316] text-white rounded-full flex items-center justify-center font-bold text-lg">G</div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-4 pl-12 border border-[#E5E7EB] rounded-full focus:outline-none focus:ring-2 focus:ring-[#F97316] text-[var(--foreground)] text-base"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Must Try Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              <span className="text-[#F97316]">Must</span> Try
            </h2>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide space-x-6 pb-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {mustTryItems.map((item) => (
                <div
                  key={item.id}
                  className="snap-center flex-shrink-0 w-[30rem] bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={225} // 4:3 ratio (300/225 = 4/3)
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#F97316] text-white px-3 py-1 rounded-full text-base font-semibold">
                      ₹{item.price}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">{item.name}</h3>
                    <p className="text-base text-[var(--foreground)] opacity-70">{item.description}</p>
                    <div className="flex justify-center items-center mt-4 space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="bg-[#F97316] text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold hover:bg-[#EA580C] transition-all duration-300"
                      >
                        −
                      </button>
                      <span className="text-[var(--foreground)] font-semibold text-lg">{quantities[item.id] || 0}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="bg-[#F97316] text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold hover:bg-[#EA580C] transition-all duration-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-8">
            <div className="flex overflow-x-auto space-x-3 pb-4 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-5 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#F97316] text-white'
                      : 'bg-white text-[var(--foreground)] border border-[#E5E7EB] hover:bg-[#F97316] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-6 mb-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex items-center p-4"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={90} // 4:3 ratio (120/90 = 4/3)
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">{item.name}</h3>
                  <p className="text-[#F97316] font-bold text-xl">₹{item.price}</p>
                  <p className="text-base text-[var(--foreground)] opacity-70">{item.description}</p>
                  <div className="flex justify-end items-center mt-3 space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="bg-[#F97316] text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold hover:bg-[#EA580C] transition-all duration-300"
                    >
                      −
                    </button>
                    <span className="text-[var(--foreground)] font-semibold text-lg">{quantities[item.id] || 0}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="bg-[#F97316] text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold hover:bg-[#EA580C] transition-all duration-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rate Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-24">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">Rate this Hotel</h3>
            <p className="text-base text-[var(--foreground)] opacity-70 mb-4">Tell others what you think</p>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-7 h-7 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 bg-white shadow-lg p-6 flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-[var(--foreground)]">PRICE: ₹{totalPrice}</p>
          <p className="text-base text-[var(--foreground)] opacity-70">ITEMS: {totalItems}</p>
        </div>
        <button className="bg-[#F97316] text-white px-6 py-4 rounded-full font-medium hover:bg-[#EA580C] transition-all duration-300 text-base">
          View Order
        </button>
      </footer>
    </div>
  );
};

export default QrCodePage;