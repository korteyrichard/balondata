import DashboardLayout from '../../layouts/DashboardLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/icon';
import { Link } from '@inertiajs/react';



interface Order {
  id: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  network: string;
  expiry: string;
  product_type: 'customer_products' | 'agent_product' | 'dealer_product';
}

interface CartItem {
  id: number;
  product_id: number;
  quantity: string;
  beneficiary_number: string;
  product: {
    name: string;
    price: number;
    network: string;
    expiry: string;
  };
}

interface DashboardProps extends PageProps {
  cartCount: number;
  cartItems: CartItem[];
  walletBalance: number;
  orders: Order[];
  totalSales: number;
  todaySales: number;
  pendingOrders: number;
  processingOrders: number;
  products: Product[];
}

export default function Dashboard({ auth }: DashboardProps) {
  const { cartCount, cartItems, walletBalance: initialWalletBalance, orders, totalSales, todaySales, pendingOrders, processingOrders, products } = usePage<DashboardProps>().props;

  const [walletBalance, setWalletBalance] = useState(initialWalletBalance ?? 0);
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);





  const handleRemoveFromCart = (cartId: number) => {
    router.delete(route('remove.from.cart', cartId));
  };



  return (
    <DashboardLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
    >
      <Head title="Dashboard" />



      <div className="min-h-screen bg-white">
        {/* Action Buttons Section */}
        {auth.user.role === 'customer' && (
          <div className="px-4 sm:px-8 mb-8">
            <div className="flex justify-end">
              <Link
                href={route('become_a_dealer')}
                className="inline-block px-6 py-2 text-white font-medium rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              >
                Become an Agent
              </Link>
            </div>
          </div>
        )}

       

        {/* Wallet Section */}
        <div className="px-4 sm:px-8">
          <div className="bg-primary rounded-xl shadow-2xl p-4 sm:p-6 mb-8 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <p className="text-primary-foreground text-sm mb-1 font-medium">Wallet Balance</p>
                <p className="text-lg sm:text-lg font-bold text-primary-foreground drop-shadow-sm">GHS {walletBalance}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-primary-foreground text-sm mb-2 font-medium">Wallet Top Up</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input 
                    type="number" 
                    placeholder="Enter Amount" 
                    value={addAmount}
                    onChange={e => setAddAmount(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm w-full sm:w-40 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button 
                    onClick={async () => {
                      if (!addAmount) return;
                      setIsAdding(true);
                      try {
                        const response = await fetch('/dashboard/wallet/add', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                          },
                          body: JSON.stringify({ amount: addAmount }),
                        });
                        const data = await response.json();
                        if (data.success && data.payment_url) {
                          window.location.href = data.payment_url;
                        } else {
                          alert(data.message || 'Failed to initialize payment.');
                        }
                      } catch (err) {
                        alert('Error initializing payment.');
                      } finally {
                        setIsAdding(false);
                      }
                    }}
                    disabled={!addAmount || isAdding}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 w-full sm:w-auto disabled:opacity-50"
                  >
                    {isAdding ? 'Processing...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Main Content Grid */}
        <div className="px-4 sm:px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl shadow-2xl p-4 sm:p-6 border border-border/50">
              <h3 className="text-lg font-semibold mb-6 text-foreground drop-shadow-sm">Available Networks</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* MTN Card */}
                <div 
                  onClick={() => router.visit(route('product.single', { network: 'MTN' }))}
                  className="cursor-pointer bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-square flex flex-col items-center justify-center shadow-xl border border-yellow-400/30"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <img src="/mtnlogo.jpeg" alt="MTN" className="w-12 h-12 object-contain rounded-lg" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold drop-shadow-md">MTN</h4>
                      <p className="text-white/90 text-sm font-medium drop-shadow-sm">Data Bundles</p>
                    </div>
                  </div>
                </div>

                {/* Telecel Card */}
                <div 
                  onClick={() => router.visit(route('product.single', { network: 'TELECEL' }))}
                  className="cursor-pointer bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-square flex flex-col items-center justify-center shadow-xl border border-red-500/30"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <img src="/telecellogo.png" alt="Telecel" className="w-12 h-12 object-contain rounded-lg" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold drop-shadow-md">Telecel</h4>
                      <p className="text-white/90 text-sm font-medium drop-shadow-sm">Data Bundles</p>
                    </div>
                  </div>
                </div>

                {/* AT iShare Card */}
                <div 
                  onClick={() => router.visit(route('product.single', { network: 'ISHARE' }))}
                  className="cursor-pointer bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-square flex flex-col items-center justify-center shadow-xl border border-blue-500/30"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <img src="/atlogo.png" alt="AT iShare" className="w-12 h-12 object-contain rounded-lg" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold drop-shadow-md">AT - iShare</h4>
                      <p className="text-white/90 text-sm font-medium drop-shadow-sm">Data Bundles</p>
                    </div>
                  </div>
                </div>

                {/* AT BigTime Card */}
                <div 
                  onClick={() => router.visit(route('product.single', { network: 'BIGTIME' }))}
                  className="cursor-pointer bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 aspect-square flex flex-col items-center justify-center shadow-xl border border-blue-500/30"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <img src="/atlogo.png" alt="AT BigTime" className="w-12 h-12 object-contain rounded-lg" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-bold drop-shadow-md">AT - BigTime</h4>
                      <p className="text-white/90 text-sm font-medium drop-shadow-sm">Data Bundles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Cart Button */}
        {cartCount > 0 && (
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            <button
              onClick={() => router.visit('/cart')}
              className="relative bg-primary text-primary-foreground rounded-full p-4 shadow-2xl transform hover:scale-110 transition-all duration-300 animate-bounce"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
