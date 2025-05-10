"use client";
import Image from 'next/image';
import { useState, useEffect, useRef, Fragment } from 'react';
import { FiSearch, FiPlus, FiMinus, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';

// Hardcoded data from the template
const mustTryItems = [
  { id: 1, name: 'Butter Jam Cheese Toast', price: 55, description: 'Toast with butter, jam and cheese', image: '/items/image.png', category: 'Sandwich' },
  { id: 2, name: 'Butter Chocolate Cheese Toast', price: 70, description: 'Toast with butter, chocolate and cheese', image: '/items/image.png', category: 'Sandwich' },
  { id: 1, name: 'Butter Jam Cheese Toast', price: 55, description: 'Toast with butter, jam and cheese', image: '/items/image.png', category: 'Sandwich' },
  { id: 2, name: 'Butter Chocolate Cheese Toast', price: 70, description: 'Toast with butter, chocolate and cheese', image: '/items/image.png', category: 'Sandwich' },
  { id: 3, name: 'White Cheese Toast', price: 65, description: 'Toast with white chocolate and...', image: '/items/image.png', category: 'Sandwich'},
  
];

const categories = [
  'Fruit & Nuts', 'Sandwich', 'Burger', 'Bites', 'Burger Meal', 'Wraps',
  'Wraps Meal', 'Maggie'
];

const items = [
  { id: 1, name: 'Butter Jam Cheese Toast', price: 55, description: 'Toast with butter, jam and cheese', image: '/items/image.png', category: 'Sandwich', mustTry: true },
  { id: 2, name: 'Butter Chocolate Cheese Toast', price: 70, description: 'Toast with butter, chocolate and cheese', image: '/items/image.png', category: 'Sandwich', mustTry: true },
  { id: 3, name: 'White Cheese Toast', price: 65, description: 'Toast with white chocolate and...', image: '/items/image.png', category: 'Sandwich', mustTry: false },
  // Existing Sandwich items
  { id: 1, name: 'Butter Jam Cheese Toast', price: 55, description: 'Toast with butter, jam and cheese', image: '/items/image.png', category: 'Sandwich', mustTry: true },
  { id: 2, name: 'Butter Chocolate Cheese Toast', price: 70, description: 'Toast with butter, chocolate and cheese', image: '/items/image.png', category: 'Sandwich', mustTry: true },
  { id: 3, name: 'White Cheese Toast', price: 65, description: 'Toast with white chocolate and...', image: '/items/image.png', category: 'Sandwich', mustTry: false },
  { id: 4, name: 'Peanut Cheese Toast', price: 65, description: 'Toast with peanuts and cheese', image: '/items/image.png', category: 'Sandwich', mustTry: false },
  { id: 5, name: 'Chocolate Toast', price: 70, description: 'Chocolate toast', image: '/items/image.png', category: 'Sandwich', mustTry: false },
  { id: 6, name: 'Dry Fruit Cheese Toast', price: 65, description: 'Toast with dry fruits and cheese', image: '/items/image.png', category: 'Sandwich', mustTry: false },
  { id: 7, name: 'Peanut Fruit Cheese Toast', price: 85, description: 'Toast with peanuts, fruits and cheese', image: '/items/image.png', category: 'Sandwich', mustTry: false },
  
  // Additional Sandwich items
  { id: 8, name: 'Club Sandwich', price: 95, description: 'Triple-decker sandwich with chicken, bacon, lettuce, and tomato', image: '/items/image.png', category: 'Sandwich', mustTry: false },
  { id: 9, name: 'Veggie Delight Sandwich', price: 80, description: 'Fresh vegetables with herb mayo on multigrain bread', image: '/items/image.png', category: 'Sandwich', mustTry: false },
  
  // Fruit & Nuts items
  { id: 10, name: 'Mixed Nut Bowl', price: 120, description: 'Assortment of premium nuts including almonds, cashews, and walnuts', image: '/items/image.png', category: 'Fruit & Nuts', mustTry: true },
  { id: 11, name: 'Fresh Fruit Platter', price: 110, description: 'Seasonal fruits served with honey yogurt dip', image: '/items/image.png', category: 'Fruit & Nuts', mustTry: false },
  { id: 12, name: 'Tropical Fruit Bowl', price: 130, description: 'Exotic tropical fruits including mango, pineapple, and papaya', image: '/items/image.png', category: 'Fruit & Nuts', mustTry: false },
  { id: 13, name: 'Trail Mix Cup', price: 90, description: 'Energy-boosting mix of nuts, seeds, and dried fruits', image: '/items/image.png', category: 'Fruit & Nuts', mustTry: false },
  
  // Burger items
  { id: 14, name: 'Classic Cheeseburger', price: 150, description: 'Juicy beef patty with cheddar cheese, lettuce, and special sauce', image: '/items/image.png', category: 'Burger', mustTry: true },
  { id: 15, name: 'Veggie Burger', price: 130, description: 'House-made vegetable patty with avocado and sriracha mayo', image: '/items/image.png', category: 'Burger', mustTry: false },
  { id: 16, name: 'Spicy Chicken Burger', price: 145, description: 'Crispy chicken fillet with jalapenos and spicy sauce', image: '/items/image.png', category: 'Burger', mustTry: false },
  
  // Burger Meal items
  { id: 17, name: 'Double Beef Meal', price: 250, description: 'Double beef burger with fries and soft drink', image: '/items/image.png', category: 'Burger Meal', mustTry: true },
  { id: 18, name: 'Chicken Burger Meal', price: 220, description: 'Chicken burger with onion rings and milkshake', image: '/items/image.png', category: 'Burger Meal', mustTry: false },
  { id: 19, name: 'Veggie Meal Deal', price: 200, description: 'Veggie burger with sweet potato fries and fresh juice', image: '/items/image.png', category: 'Burger Meal', mustTry: false },
  
  // Bites items
  { id: 20, name: 'Mozzarella Sticks', price: 110, description: 'Crispy breaded mozzarella with marinara dipping sauce', image: '/items/image.png', category: 'Bites', mustTry: false },
  { id: 21, name: 'Loaded Nachos', price: 140, description: 'Tortilla chips topped with cheese, jalapeños, and sour cream', image: '/items/image.png', category: 'Bites', mustTry: true },
  { id: 22, name: 'Chicken Wings', price: 160, description: 'Spicy buffalo wings served with blue cheese dip', image: '/items/image.png', category: 'Bites', mustTry: false },
  { id: 23, name: 'Onion Rings', price: 90, description: 'Crispy battered onion rings with garlic aioli', image: '/items/image.png', category: 'Bites', mustTry: false },
  
  // Wraps items
  { id: 24, name: 'Chicken Caesar Wrap', price: 130, description: 'Grilled chicken with romaine lettuce and caesar dressing', image: '/items/image.png', category: 'Wraps', mustTry: true },
  { id: 25, name: 'Falafel Wrap', price: 120, description: 'Homemade falafel with tahini sauce and pickles', image: '/items/image.png', category: 'Wraps', mustTry: false },
  { id: 26, name: 'BBQ Pulled Pork Wrap', price: 145, description: 'Slow-cooked pork with coleslaw and BBQ sauce', image: '/items/image.png', category: 'Wraps', mustTry: false },
  
  // Wraps Meal items
  { id: 27, name: 'Chicken Wrap Meal', price: 190, description: 'Chicken wrap with fries and soft drink', image: '/items/image.png', category: 'Wraps Meal', mustTry: false },
  { id: 28, name: 'Vegan Wrap Combo', price: 180, description: 'Vegan wrap with salad and fruit juice', image: '/items/image.png', category: 'Wraps Meal', mustTry: true },
  { id: 29, name: 'Fish Wrap Platter', price: 210, description: 'Fish wrap with coleslaw and lemonade', image: '/items/image.png', category: 'Wraps Meal', mustTry: false },
  
  // Maggie items
  { id: 30, name: 'Classic Maggie', price: 60, description: 'Traditional Maggie noodles with special spices', image: '/items/image.png', category: 'Maggie', mustTry: true },
  { id: 31, name: 'Cheese Maggie', price: 75, description: 'Maggie noodles loaded with melted cheese', image: '/items/image.png', category: 'Maggie', mustTry: false },
  { id: 32, name: 'Veggie Maggie', price: 80, description: 'Maggie noodles with mixed vegetables', image: '/items/image.png', category: 'Maggie', mustTry: false },
  { id: 33, name: 'Butter Masala Maggie', price: 85, description: 'Spicy masala Maggie with butter', image: '/items/image.png', category: 'Maggie', mustTry: false }
];
const partner = {
  id: "V6sBROaGmdaYnrXwZZ4Nwqe5Lhc2",
  phone: "+1-555-123-4567",
  shop_name: "Delicious Bites",
  location: "123 Main Street, Cityville, ST 12345",
  email: "restaurant@example.com"
};

const TemplatePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Sandwich');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  

  // Update total price and items
  const updateTotals = (newQuantities: Record<string, number>) => {
    let price = 0;
    let itemsCount = 0;
    Object.entries(newQuantities).forEach(([id, quantity]) => {
      const item = items.find((i) => i.id === parseInt(id));
      if (item) {
        price += item.price * quantity;
        itemsCount += quantity;
      }
    });
    setTotalPrice(price);
    setTotalItems(itemsCount);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: number, delta: number) => {
    const id = itemId.toString();
    setQuantities((prev) => {
      const newQuantity = (prev[id] || 0) + delta;
      if (newQuantity < 0) return prev;
      const newQuantities = { ...prev, [id]: newQuantity };
      updateTotals(newQuantities);
      return newQuantities;
    });
  };

  // Format phone number for WhatsApp
  const formatPhoneForWhatsApp = (phone: string | undefined): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // For WhatsApp, we need the international format without any leading zeros
    if (digitsOnly.startsWith('91') && digitsOnly.length > 10) {
      return digitsOnly; // Already has country code
    } else if (digitsOnly.startsWith('0')) {
      // Remove leading zero and add country code 91 (for India)
      return '91' + digitsOnly.substring(1);
    } else if (digitsOnly.length === 10) {
      // It's likely a 10-digit number without country code
      return '91' + digitsOnly;
    }
    
    // If it doesn't match the patterns above, return as is
    return digitsOnly;
  };

  // Generate order summary text for WhatsApp
  const generateOrderSummary = (): string => {
    if (totalItems === 0) return "I'm interested in ordering from your menu";
    
    let summary = `Order from ${partner.shop_name}:\n\n`;
    
    // Add items with quantities
    Object.entries(quantities)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, quantity]) => quantity > 0)
      .forEach(([itemId, quantity]) => {
        const item = items.find(i => i.id === parseInt(itemId));
        if (item) {
          summary += `${quantity}x ${item.name} - ₹${item.price} each\n`;
        }
      });
    
    // Add total
    summary += `\nTotal: ₹${totalPrice.toFixed(2)}`;
    summary += `\n\nThank you!`;
    
    return encodeURIComponent(summary);
  };

  // Open WhatsApp with order details
  const openWhatsApp = () => {
    const phone = formatPhoneForWhatsApp(partner.phone);
    const summary = generateOrderSummary();
    
    if (!phone) {
      console.error("Sorry, we don't have this restaurant's phone number");
      return;
    }
    
    const whatsappURL = `https://wa.me/${phone}?text=${summary}`;
    window.open(whatsappURL, '_blank');
  };

  // Filter items based on selected category and search query
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = searchQuery.trim() === '' ? 
      true : 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Automatic scrolling for Must Try section
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const mustTryItems = items.filter((item) => item.mustTry);
        if (mustTryItems.length <= 1) return;
        
        const scrollContainer = scrollRef.current;
        const cardWidth = scrollContainer.querySelector('div')?.offsetWidth || 0;
        const scrollWidth = scrollContainer.scrollWidth;
        const currentPosition = scrollContainer.scrollLeft;
        
        // If we're close to the end, jump back to the start
        if (currentPosition + cardWidth * 1.5 >= scrollWidth) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainer.scrollTo({ 
            left: currentPosition + cardWidth + 24, // card width + gap
            behavior: 'smooth' 
          });
        }
      }
    }, 5000); // Scroll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const submitRating = () => {
    console.log(`Submitted rating: ${rating} stars`);
    // Here you would typically send the rating to your backend
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 flex flex-col">
      {/* Add decorative font import for the shop name and Must Try text */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
        
        .font-decorative {
          font-family: 'Pacifico', cursive;
        }
      `}</style>
      
      {/* Header - With horizontal alignment and decorative font */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 sm:p-8 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <div 
                className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-orange-100 shadow-md mr-4 cursor-pointer" 
                onClick={openWhatsApp}
                title="Contact on WhatsApp"
              >
                <Image 
                  src={`https://ui-avatars.com/api/?name=${partner.shop_name}&background=F97316&color=fff&size=256`} 
                  alt={partner.shop_name} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-decorative">
                <span className="text-orange-500">{partner.shop_name.split(' ')[0]}</span>
                <span className="text-gray-800"> {partner.shop_name.split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-4 md:py-6 px-4 max-w-5xl mx-auto w-full">
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 pl-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800 shadow-sm"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Must Try Section */}
        {mustTryItems.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-decorative">
                <span className="text-orange-500">Must</span> Try
              </h2>
              <div className="flex gap-1">
                {[...Array(Math.min(mustTryItems.length, 4))].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === 0 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-6 pb-4 no-scrollbar -mx-4 px-4"
            >
              {mustTryItems.map((item) => (
                <div
                  key={item.id}
                  className="snap-center flex-shrink-0 w-[280px] md:w-[320px] bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <div 
                    className="relative w-full h-48 cursor-pointer" 
                    onClick={openWhatsApp}
                    title="Contact on WhatsApp"
                  >
                    <Image
                      src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 280px, 320px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                      ₹{item.price}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-white/90 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">{item.category}</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={!quantities[item.id]}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
                            quantities[item.id.toString()] ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-5 text-center">{quantities[item.id.toString()] || 0}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="mb-6">
          <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-5 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-orange-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Items List */}
        <section className="mb-32">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-500">No items found matching your criteria.</p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-orange-500 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="flex">
                    {/* Square image on left with padding */}
                    <div className="p-3 sm:p-4">
                      <div 
                        className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer" 
                        onClick={openWhatsApp}
                        title="Contact on WhatsApp"
                      >
                        <Image
                          src={item.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                          className="object-cover"
                        />
                        {item.mustTry && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            Must Try
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Details on right */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-xs text-gray-500 mb-1">{item.category}</p>
                        </div>
                        <p className="text-lg font-bold text-orange-500">₹{item.price}</p>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex justify-end items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={!quantities[item.id.toString()]}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
                            quantities[item.id.toString()] ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-5 text-center">{quantities[item.id.toString()] || 0}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Rating Section */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-24">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Rate this Experience</h3>
          <p className="text-sm text-gray-500 mb-4">Tell others what you think</p>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <FaStar 
                  className={`w-7 h-7 transition-colors ${
                    (hoverRating || rating) > i 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              </button>
            ))}
          </div>
          <button 
            onClick={submitRating}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Submit Rating
          </button>
        </section>
      </main>

      {/* Footer - Contact info */}
      <footer className="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pt-6 pb-20 sm:pb-6 z-20">
        <div className="max-w-5xl mx-auto px-4">
          {/* Contact Info */}
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold mb-4 font-decorative">
              <span className="text-orange-500">Contact</span> Information
            </h3>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
              {partner.location && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{partner.location}</span>
                </div>
              )}
              {partner.phone && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">{partner.phone}</span>
                </div>
              )}
              {partner.email && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{partner.email}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} {partner.shop_name}. All rights reserved.</p>
            <p className="mt-1">Powered by Royal Breeze</p>
          </div>
        </div>
      </footer>

      {/* Sticky Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-30">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-gray-800">₹{totalPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-500">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <button 
            onClick={() => setShowOrderPanel(true)}
            disabled={totalItems === 0}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              totalItems > 0
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            View Order
          </button>
        </div>
      </div>

      {/* Order Panel */}
      <Transition show={showOrderPanel} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowOrderPanel(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 sm:scale-95 translate-y-full sm:translate-y-0"
                enterTo="opacity-100 sm:scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 sm:scale-100 translate-y-0"
                leaveTo="opacity-0 sm:scale-95 translate-y-full sm:translate-y-0"
              >
                <Dialog.Panel className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl transform transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                      <Dialog.Title className="text-2xl font-semibold text-gray-800">
                        Your Order
                      </Dialog.Title>
                      <button
                        onClick={() => setShowOrderPanel(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="max-h-[50vh] overflow-y-auto pr-2">
                      {Object.entries(quantities)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([itemId, quantity]) => {
                          const item = items.find(i => i.id === parseInt(itemId));
                          if (!item) return null;
                          
                          return (
                            <div key={itemId} className="flex items-center justify-between py-3 border-b border-gray-100">
                              <div className="flex items-center gap-3">
                                <div className="bg-orange-100 text-orange-500 w-7 h-7 rounded-full flex items-center justify-center font-medium">
                                  {quantity}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800">{item.name}</h4>
                                  <p className="text-sm text-gray-500">₹{item.price} each</p>
                                </div>
                              </div>
                              <p className="font-semibold text-gray-800">₹{(item.price * quantity).toFixed(2)}</p>
                            </div>
                          );
                        })}
                        
                      {Object.values(quantities).filter(q => q > 0).length === 0 && (
                        <div className="py-8 text-center text-gray-500">
                          Your order is empty. Add some items!
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <p>Total</p>
                        <p>₹{totalPrice.toFixed(2)}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                          className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                          onClick={() => {
                            console.log('Order placed!');
                            setShowOrderPanel(false);
                            openWhatsApp();
                          }}
                        >
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default TemplatePage;