'use client';

import CachedImage from '@/components/CachedImages';
import { useState, useEffect, useRef, Fragment } from 'react';
import { use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiMinus, FiX, FiLoader, FiUploadCloud } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  mustTry: boolean;
  partnerId: string;
}

interface Partner {
  id: string;
  name?: string;
  shop_name?: string; // Added shop_name field
  email: string;
  phone?: string;
  location?: string;
  uid: string;
}

interface Category {
  name: string;
}

interface CategoriesResponse {
  categories: Category[];
}

interface NewItem {
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  mustTry: boolean;
}

interface NewCategory {
  name: string;
}

const QrCodePage = ({ params }: { params: Promise<{ uid: string }> }) => {
  const { uid } = use(params);
  const { user } = useAuth();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPartner, setIsPartner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newItem, setNewItem] = useState<NewItem>({
    name: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    mustTry: false
  });
  const [newCategory, setNewCategory] = useState<NewCategory>({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const toastTracker = useRef<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);



  // Check if user is a partner or admin
  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setIsPartner(false);
        setIsAdmin(false);
        return;
      }
      
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/v1/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          setIsPartner(false);
          setIsAdmin(false);
          return;
        }

        const data = await response.json();
        setIsPartner(data.role === 'partner');
        setIsAdmin(data.role === 'admin');
      } catch {
        setIsPartner(false);
        setIsAdmin(false);
      }
    };

    checkUserRole();
  }, [user]);

  // Fetch partner and items based on UID
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const headers: HeadersInit = {};
        
        // Only add auth header if user is logged in
        if (user) {
          const token = await user.getIdToken();
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Fetch partner details
        const partnerResponse = await fetch('/api/v1/partner', { headers });
        if (!partnerResponse.ok) throw new Error('Failed to fetch partner details');
        const partnerData = await partnerResponse.json();
        const partnerInfo = partnerData.partners.find((p: Partner) => p.id === uid);
        if (!partnerInfo) throw new Error('Partner not found');
        setPartner(partnerInfo);

        // Fetch items for the partner
        const itemsResponse = await fetch(`/api/v1/item?partnerId=${uid}`, { headers });
        if (!itemsResponse.ok) throw new Error('Failed to fetch items');
        const itemsData = await itemsResponse.json();
        setItems(itemsData.items);

        // Fetch categories for the partner
        const categoriesResponse = await fetch(`/api/v1/category?partnerId=${uid}`, { headers });
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json() as CategoriesResponse;
        const uniqueCategories = [...new Set(categoriesData.categories.map(cat => cat.name))];
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading the page';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [uid, user]);

  const formatPhoneForWhatsApp = (phone: string | undefined): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    
    // For WhatsApp, we need the international format without any leading zeros
    // If the number starts with a country code (e.g., +91 for India), keep it
    // Otherwise, we assume it's an Indian number and add 91
    
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
    // This might be a number with country code but not starting with 91
    return digitsOnly;
  };

  const generateOrderSummary = (): string => {
    if (totalItems === 0) return "I'm interested in ordering from your menu";
    
    let summary = `Order from ${shopName}:\n\n`;
    
    // Add items with quantities
    Object.entries(quantities)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, quantity]) => quantity > 0)
      .forEach(([itemId, quantity]) => {
        const item = items.find(i => i.id === itemId);
        if (item) {
          summary += `${quantity}x ${item.name} - ₹${item.price} each\n`;
        }
      });
    
    // Add totals
    summary += `\nSubtotal: ₹${totalPrice.toFixed(2)}`;
    summary += `\nTotal: ₹${(totalPrice * 1.05).toFixed(2)}`;
    
    summary += `\n\nThank you!`;
    
    return encodeURIComponent(summary);
  };

  const openWhatsApp = () => {
    const phone = formatPhoneForWhatsApp(partner?.phone);
    const summary = generateOrderSummary();
    
    if (!phone) {
      toast.error("Sorry, we don't have this restaurant's phone number");
      return;
    }
    
    const whatsappURL = `https://wa.me/${phone}?text=${summary}`;
    window.open(whatsappURL, '_blank');
  };



  // Update total price and items
  const updateTotals = (newQuantities: Record<string, number>) => {
    let price = 0;
    let itemsCount = 0;
    Object.entries(newQuantities).forEach(([id, quantity]) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        price += item.price * quantity;
        itemsCount += quantity;
      }
    });
    setTotalPrice(price);
    setTotalItems(itemsCount);
  };

  // Handle quantity change
  const handleQuantityChange = (itemId: string, delta: number) => {
    // Whether adding or removing, we need to update the quantities first
    setQuantities((prev) => {
      const currentQuantity = prev[itemId] || 0;
      const newQuantity = currentQuantity + delta;
      
      // If new quantity would be less than 0, don't change anything
      if (newQuantity < 0) return prev;
      
      // Create the new quantities object
      const newQuantities = { ...prev };
      
      // If the new quantity is 0, remove the item from the object
      if (newQuantity === 0) {
        delete newQuantities[itemId];
      } else {
        newQuantities[itemId] = newQuantity;
      }
      
      // Update the totals with the new quantities
      updateTotals(newQuantities);
      return newQuantities;
    });
    
    // Only show toast for adding items
    if (delta > 0) {
      const item = items.find(i => i.id === itemId);
      
      // Generate a unique key for this action
      const toastKey = `${itemId}_${Date.now()}`;
      
      // Only show toast if we haven't tracked this key
      if (item && !toastTracker.current[toastKey]) {
        // Mark this toast as shown
        toastTracker.current[toastKey] = 1;
        
        // Show toast notification after a very short delay
        setTimeout(() => {
          toast.success(`Added ${item.name} to your order`);
          
          // Clean up the tracker after some time to prevent memory leaks
          setTimeout(() => {
            delete toastTracker.current[toastKey];
          }, 2000);
        }, 10);
      }
    } else if (delta < 0) {
      // Optionally, you could add a small visual feedback for removing items
      const item = items.find(i => i.id === itemId);
      if (item) {
        // This is a subtle way to show an item was removed without being annoying with too many toasts
        console.log(`Removed one ${item.name} from order`);
      }
    }
  };

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
  }, [items]);

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewItem({
      name: '',
      price: 0,
      description: '',
      category: '',
      image: '',
      mustTry: false
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddCategory = () => {
    setIsAddingCategory(true);
  };

  const handleCancelCategory = () => {
    setIsAddingCategory(false);
    setNewCategory({ name: '' });
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ name: e.target.value });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmittingCategory(true);
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/category', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }

      // Refresh categories list
      const categoriesResponse = await fetch(`/api/v1/category?partnerId=${uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!categoriesResponse.ok) throw new Error('Failed to fetch updated categories');
      const categoriesData = await categoriesResponse.json();
      const uniqueCategories = [...new Set(categoriesData.categories.map((cat: Category) => cat.name))] as string[];
      setCategories(uniqueCategories);
      
      // Set the new category as selected
      setNewItem(prev => ({ ...prev, category: newCategory.name }));
      setIsAddingCategory(false);
      setNewCategory({ name: '' });
      
      toast.success('Category added successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the category';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleImageFile(file);
    }
  };
  
  const handleImageFile = (file: File) => {
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
  
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Modify your handleSubmit function to upload the image first
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add items");
      return;
    }
  
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Upload image first if there's an image file
      let imageUrl = newItem.image;
      if (imageFile) {
        setIsUploading(true);
        
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const token = await user.getIdToken();
        const uploadResponse = await fetch('/api/v1/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl; // Get the URL of the uploaded image
        setIsUploading(false);
      }
      
      // Now create the item with the image URL
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/item', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newItem,
          image: imageUrl,
          partnerId: uid
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create item');
      }
  
      // Refresh items list
      const itemsResponse = await fetch(`/api/v1/item?partnerId=${uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!itemsResponse.ok) {
        throw new Error('Failed to fetch updated items');
      }
      
      const itemsData = await itemsResponse.json();
      setItems(itemsData.items);
  
      // Reset and close
      setImageFile(null);
      setImagePreviewUrl('');
      handleCloseModal();
      toast.success('Item added successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the item';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const submitRating = () => {
    if (rating > 0) {
      toast.success(`Thank you for rating ${rating} stars!`);
    } else {
      toast.error('Please select a rating first');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-orange-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-50"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-orange-50 p-6">
        <div className="bg-red-50 p-6 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!partner || !items) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-orange-50">
        <p className="text-gray-600">No menu data available</p>
      </div>
    );
  }

  const mustTryItems = items.filter((item) => item.mustTry);
  
  // Filter items based on selected category and search query
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = searchQuery.trim() === '' ? 
      true : 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get shop name (prefer shop_name if available, fallback to name)
  const shopName = partner.shop_name || partner.name || '';

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 flex flex-col">
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      
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
          <div className="p-6 sm:p-8 flex flex-row items-center">
            <div 
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-orange-100 shadow-md mr-6 cursor-pointer" 
              onClick={openWhatsApp}
              title="Contact on WhatsApp"
            >
              <CachedImage 
                src={`https://ui-avatars.com/api/?name=${shopName}&background=F97316&color=fff&size=256`} 
                alt={shopName} 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-decorative">
                <span className="text-orange-500">{shopName.split(' ')[0]}</span>
                <span className="text-gray-800"> {shopName.split(' ').slice(1).join(' ')}</span>
              </h1>
              
              {/* Admin/Partner Controls */}
              {(isPartner || isAdmin) && (
                <div className="mt-3">
                  <button
                    onClick={handleAddItem}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              )}
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

        {/* Must Try Section - With decorative font */}
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
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="snap-center flex-shrink-0 w-[280px] md:w-[320px] bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                >
                  <div 
                    className="relative w-full h-48 cursor-pointer" 
                    onClick={openWhatsApp}
                    title="Contact on WhatsApp"
                  >
                    <CachedImage
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
                            quantities[item.id] ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="font-medium w-5 text-center">{quantities[item.id] || 0}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl p-8 text-center"
              >
                <p className="text-gray-500">No items found matching your criteria.</p>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-orange-500 hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="flex">
                      {/* Square image on left with padding - Now clickable */}
                      <div className="p-3 sm:p-4">
                        <div 
                          className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer" 
                          onClick={openWhatsApp}
                          title="Contact on WhatsApp"
                        >
                          <CachedImage
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
                            disabled={!quantities[item.id]}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
                              quantities[item.id] ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-5 text-center">{quantities[item.id] || 0}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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

      {/* Footer - Contact info with decorative font */}
      <footer className="bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pt-6 pb-20 sm:pb-6 z-20">
        <div className="max-w-5xl mx-auto px-4">
          {/* Contact Info */}
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold mb-4 font-decorative">
              <span className="text-orange-500">Contact</span> Information
            </h3>
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
              {partner?.location && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{partner.location}</span>
                </div>
              )}
              {partner?.phone && (
                <div className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">{partner.phone}</span>
                </div>
              )}
              {partner?.email && (
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
            <p>© {new Date().getFullYear()} {shopName}. All rights reserved.</p>
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

      {/* Add Item Modal */}
      <Transition show={showAddModal} as={Fragment}>
  <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
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
      <div className="flex min-h-full items-center justify-center p-4">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-2xl font-semibold text-gray-800">
                  {isAddingCategory ? 'Add New Category' : 'Add New Item'}
                </Dialog.Title>
                <button
                  onClick={isAddingCategory ? handleCancelCategory : handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {isAddingCategory ? (
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={handleCategoryInputChange}
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                      placeholder="Enter category name"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelCategory}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingCategory}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingCategory ? 'Adding...' : 'Add Category'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={newItem.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                        placeholder="Item name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={newItem.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <div className="flex gap-2">
                      <select
                        name="category"
                        value={newItem.category}
                        onChange={handleInputChange}
                        required
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center"
                      >
                        <FiPlus className="w-5 h-5 mr-1" />
                        Add New
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={newItem.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                      placeholder="Describe your item"
                    />
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden" 
                    />
                    
                    <div 
                      ref={dropZoneRef}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragging 
                          ? 'border-orange-500 bg-orange-50' 
                          : imageFile 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                      }`}
                    >
                      {imageFile ? (
                        <div className="space-y-2">
                          <div className="relative w-full h-48 mx-auto rounded-lg overflow-hidden">
                            <CachedImage
                              src={imagePreviewUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-600">{imageFile.name}</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageFile(null);
                              setImagePreviewUrl('');
                              setNewItem(prev => ({ ...prev, image: '' }));
                            }}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                          >
                            Change Image
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="text-gray-700 font-medium">
                            Drag and drop an image here
                          </div>
                          <p className="text-gray-500 text-sm">
                            or <span className="text-orange-500">click to browse</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                    {isUploading && (
                      <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                        <FiLoader className="animate-spin mr-2 h-4 w-4" />
                        Uploading image...
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="mustTry"
                      name="mustTry"
                      checked={newItem.mustTry}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="mustTry" className="ml-2 block text-sm text-gray-700">
                      Mark as &quot;Must Try&quot;
                    </label>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin mr-2 h-4 w-4" />
                          Adding...
                        </>
                      ) : (
                        'Add Item'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  </Dialog>
</Transition>

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
                          const item = items.find(i => i.id === itemId);
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
                        <p>₹{(totalPrice).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                          className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                          onClick={() => {
                            toast.success('Your order has been placed!');
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

export default QrCodePage;