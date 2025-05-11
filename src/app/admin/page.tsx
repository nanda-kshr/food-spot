"use client";
import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Dialog, Transition } from '@headlessui/react';
import { FiPlus, FiX, FiLoader, FiMapPin, FiMail, FiPhone, FiUser } from 'react-icons/fi';

interface Partner {
  id: string;
  email: string;
  phone?: string;
  shop_name?: string;
  location?: string;
  role?: string;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

const AdminPage = () => {

  const { user } = useAuth();
  const router = useRouter();
  
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newPartner, setNewPartner] = useState({
    email: '',
    password: '',
    role: 'partner',
    phone: '',
    shop_name: '',
    location: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      setLoading(true);
      return;
    }else{
      setLoading(false);
    }
    const checkAdminAccess = async () => {
      try {
        const token = await user?.getIdToken();
        const response = await fetch('/api/v1/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Not authorized');
        }
        
        const data = await response.json();
        if (data.role !== 'admin') {
          router.push('/');
        }
      } catch (err) {
        console.error('Auth error:', err);
      }
    };
    
    checkAdminAccess();
  }, [user]);

  useEffect(() => {
    const fetchPartners = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const token = await user.getIdToken();
        const response = await fetch('/api/v1/partner', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch partners');
        }
        
        const data = await response.json();
        setPartners(data.partners || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPartners();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPartner(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setSubmitError('You must be logged in to add a partner');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      const token = await user.getIdToken();
      const response = await fetch('/api/v1/partner', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPartner)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create partner');
      }
      
      // Reset form and show success
      setNewPartner({
        email: '',
        password: '',
        role: 'partner',
        phone: '',
        shop_name: '',
        location: ''
      });
      
      setSubmitSuccess(true);
      
      // Refresh partners list
      const partnersResponse = await fetch('/api/v1/partner', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (partnersResponse.ok) {
        const data = await partnersResponse.json();
        setPartners(data.partners || []);
      }
      
      // Close modal after a delay
      setTimeout(() => {
        setShowAddModal(false);
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp?: { _seconds: number; _nanoseconds: number }) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Partners</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Add Partner
              </button>
            </div>
          </div>

          {/* Partners List */}
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="flex items-center gap-2">
                <FiLoader className="w-5 h-5 text-orange-500 animate-spin" />
                <span className="text-gray-500">Loading partners...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="text-orange-500 hover:text-orange-600"
              >
                Try again
              </button>
            </div>
          ) : partners.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No partners found. Add your first partner using the button above.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => {
                    setSelectedPartner(partner);
                    setShowPartnerModal(true);
                  }}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div className="relative w-16 h-16 bg-orange-100 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={`https://ui-avatars.com/api/?name=${partner.shop_name || 'Partner'}&background=F97316&color=fff&size=128`}
                          alt={partner.shop_name || 'Partner'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                          {partner.shop_name || 'Unnamed Partner'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Created: {formatDate(partner.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {partner.location && (
                        <div className="flex items-start text-sm">
                          <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 line-clamp-2">{partner.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <FiMail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{partner.email}</span>
                      </div>
                      {partner.phone && (
                        <div className="flex items-center text-sm">
                          <FiPhone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{partner.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        ID: {partner.id.substring(0, 8)}...
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {partner.role || 'partner'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Partner Details Modal */}
      <Transition appear show={showPartnerModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowPartnerModal(false)}>
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
                <Dialog.Panel className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-xl transform transition-all">
                  {selectedPartner && (
                    <>
                      <div className="relative">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-600 h-32"></div>
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => setShowPartnerModal(false)}
                            className="bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white/30 transition-colors"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="absolute -bottom-12 left-6">
                          <div className="relative w-24 h-24 bg-orange-100 rounded-xl overflow-hidden border-4 border-white shadow-md">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${selectedPartner.shop_name || 'Partner'}&background=F97316&color=fff&size=128`}
                              alt={selectedPartner.shop_name || 'Partner'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-16 pb-6 px-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                          {selectedPartner.shop_name || 'Unnamed Partner'}
                        </h2>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <FiUser className="w-4 h-4 mr-1" />
                          <span>{selectedPartner.role || 'partner'}</span>
                          <span className="mx-2">•</span>
                          <span>ID: {selectedPartner.id}</span>
                        </div>

                        <div className="mt-6 space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                            <div className="space-y-3">
                              <div className="flex">
                                <FiMail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Email</p>
                                  <p className="text-sm text-gray-500">{selectedPartner.email}</p>
                                </div>
                              </div>
                              {selectedPartner.phone && (
                                <div className="flex">
                                  <FiPhone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Phone</p>
                                    <p className="text-sm text-gray-500">{selectedPartner.phone}</p>
                                  </div>
                                </div>
                              )}
                              {selectedPartner.location && (
                                <div className="flex">
                                  <FiMapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Location</p>
                                    <p className="text-sm text-gray-500">{selectedPartner.location}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-500 mb-3">Additional Information</h3>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Created At</p>
                                <p className="text-sm text-gray-500">{formatDate(selectedPartner.createdAt)}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">QR Code URL</p>
                                <p className="text-sm text-blue-500 hover:underline">
                                  <a href={`/qrcode/${selectedPartner.id}`} target="_blank">
                                    {`/qrcode/${selectedPartner.id}`}
                                  </a>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-6 space-x-3">
                          <button
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                            onClick={() => setShowPartnerModal(false)}
                          >
                            Close
                          </button>
                          <button
                            className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors"
                            onClick={() => {
                              // Navigate to partner's QR page
                              window.open(`/qrcode/${selectedPartner.id}`, '_blank');
                            }}
                          >
                            View QR Page
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Partner Modal */}
      <Transition appear show={showAddModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowAddModal(false)}>
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
                <Dialog.Panel className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-xl transform transition-all">
                  <div className="px-6 pt-6 pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <Dialog.Title className="text-xl font-semibold text-gray-800">
                        Add New Partner
                      </Dialog.Title>
                      <button
                        onClick={() => setShowAddModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    {submitSuccess ? (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              Partner successfully created!
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleAddPartner} className="space-y-5">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700 mb-1">
                              Restaurant Name *
                            </label>
                            <input
                              type="text"
                              id="shop_name"
                              name="shop_name"
                              value={newPartner.shop_name}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="e.g., Delicious Bites"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={newPartner.email}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="e.g., restaurant@example.com"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                              Password *
                            </label>
                            <input
                              type="password"
                              id="password"
                              name="password"
                              value={newPartner.password}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Minimum 8 characters"
                              minLength={8}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={newPartner.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="e.g., +1-555-123-4567"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              id="location"
                              name="location"
                              value={newPartner.location}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="e.g., 123 Main Street, Cityville, ST 12345"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                              Role *
                            </label>
                            <select
                              id="role"
                              name="role"
                              value={newPartner.role}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="partner">Partner</option>
                              <option value="owner">Owner</option>
                              <option value="manager">Manager</option>
                            </select>
                          </div>
                        </div>

                        {submitError && (
                          <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-red-700">
                                  {submitError}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {isSubmitting ? (
                              <>
                                <FiLoader className="animate-spin mr-2 h-4 w-4" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <FiPlus className="mr-2 h-4 w-4" />
                                Create Partner
                              </>
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
    </div>
  );
};

export default AdminPage;