/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MarketplaceScreen } from './components/MarketplaceScreen';
import { CartCheckoutScreen } from './components/CartCheckoutScreen';
import { AuthScreen } from './components/AuthScreen';
import { DeliveryBillingScreen } from './components/DeliveryBillingScreen';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { SocialLoginModal } from './components/SocialLoginModal';
import { Footer } from './components/Footer';
import { INITIAL_PRODUCTS, INITIAL_USER, INITIAL_ADDRESSES } from './data/mockData';
import { Product, CartItem, User, DeliveryAddress } from './types';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'marketplace' | 'cart' | 'auth' | 'delivery'>('marketplace');
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  
  // Initial cart with 3 items matching user's reference designs
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // Burger 360 Doble Cheddar ($7.990)
      quantity: 1,
      notes: 'Sin cebolla cruda'
    },
    {
      product: INITIAL_PRODUCTS[1], // Pizza Napolitana Familiar ($11.490)
      quantity: 1
    },
    {
      product: INITIAL_PRODUCTS[6], // Papel Higiénico Confort ($4.290)
      quantity: 1
    }
  ]);

  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [addresses] = useState<DeliveryAddress[]>(INITIAL_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1');
  
  // Modals and Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [socialModalProvider, setSocialModalProvider] = useState<'google' | 'microsoft' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`¡${product.name} agregado a tu canasta!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Producto removido');
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentScreen('delivery');
  };

  const handleOpenSocialLogin = (provider: 'google' | 'microsoft') => {
    setSocialModalProvider(provider);
  };

  const handleSocialLoginSuccess = (socialUser: User) => {
    setUser(socialUser);
    setSocialModalProvider(null);
    setIsAuthModalOpen(false);
    showToast(`¡Sesión iniciada con ${socialUser.provider === 'google' ? 'Google' : 'Microsoft'}! Bienvenido, ${socialUser.name.split(' ')[0]}`);
  };

  const handleConfirmOrder = (_orderPayload: any) => {
    showToast('🎉 ¡Pedido #PED-360-8492 recibido! Tu repartidor ya está en camino.');
    setCartItems([]);
    setCurrentScreen('marketplace');
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
  const upsellProducts = products.filter(p => p.id.startsWith('prod-upsell'));

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        cartItems={cartItems}
        cartSubtotal={cartSubtotal}
        user={user}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        selectedAddress={`${activeAddress.street} ${activeAddress.number}`}
      />

      {/* Primary Screen Render */}
      <main className="flex-1">
        {currentScreen === 'marketplace' && (
          <MarketplaceScreen
            products={products}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onGoToCheckout={() => setCurrentScreen('cart')}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />
        )}

        {currentScreen === 'cart' && (
          <CartCheckoutScreen
            cartItems={cartItems}
            upsellProducts={upsellProducts}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={(id) => setSelectedAddressId(id)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onAddToCart={handleAddToCart}
            onBackToCatalog={() => setCurrentScreen('marketplace')}
            onProceedToDelivery={handleProceedToCheckout}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen
            currentUser={user}
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              showToast(`¡Bienvenido de vuelta, ${loggedInUser.name.split(' ')[0]}!`);
              setCurrentScreen('marketplace');
            }}
            onLogout={() => {
              setUser(null);
              showToast('Sesión cerrada correctamente');
            }}
            onContinueShopping={() => setCurrentScreen('marketplace')}
            onTriggerSocialLogin={handleOpenSocialLogin}
          />
        )}

        {currentScreen === 'delivery' && user && (
          <DeliveryBillingScreen
            cartItems={cartItems}
            user={user}
            addresses={addresses}
            onBackToCart={() => setCurrentScreen('cart')}
            onConfirmOrder={handleConfirmOrder}
          />
        )}
      </main>

      {/* Cart Drawer (Flyout) */}
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onGoToCheckout={() => {
          setIsDrawerOpen(false);
          setCurrentScreen('cart');
        }}
      />

      {/* Auth Modal Triggered on Checkout when not authenticated */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectLogin={() => {
          setIsAuthModalOpen(false);
          setCurrentScreen('auth');
        }}
        onSelectRegister={() => {
          setIsAuthModalOpen(false);
          setCurrentScreen('auth');
        }}
        onLoginWithGoogle={() => {
          setIsAuthModalOpen(false);
          setSocialModalProvider('google');
        }}
        onLoginWithMicrosoft={() => {
          setIsAuthModalOpen(false);
          setSocialModalProvider('microsoft');
        }}
        onContinueAsGuest={() => {
          setIsAuthModalOpen(false);
          setCurrentScreen('delivery');
        }}
      />

      {/* Dedicated Interactive Google / Microsoft Social Login Popup */}
      <SocialLoginModal
        isOpen={socialModalProvider !== null}
        provider={socialModalProvider}
        onClose={() => setSocialModalProvider(null)}
        onSuccess={handleSocialLoginSuccess}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

