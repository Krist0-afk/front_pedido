import React from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  User, 
  ChevronDown, 
  Clock,
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { CartItem, User as UserType } from '../types';

interface HeaderProps {
  currentScreen: 'marketplace' | 'cart' | 'auth' | 'delivery';
  onNavigate: (screen: 'marketplace' | 'cart' | 'auth' | 'delivery') => void;
  cartItems: CartItem[];
  cartSubtotal: number;
  user: UserType | null;
  onOpenDrawer: () => void;
  selectedAddress: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  cartItems,
  cartSubtotal,
  user,
  onOpenDrawer,
  selectedAddress
}) => {
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-emerald-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-emerald-950 font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-full">
              SUPER360
            </span>
            <span>¡Envío GRATIS en tu primera compra de Supermercado & Comida!</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-200 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Dark Stores Santiago 20 min
            </span>
            <span className="hidden sm:flex items-center gap-1 text-emerald-100">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Entregas promedio 25 min</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('marketplace')} 
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/15 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-tighter">360°</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-emerald-950">Pedidos</span>
                <span className="font-extrabold text-xl tracking-tight text-emerald-600">360</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider block -mt-1">
                Delivery & Market
              </span>
            </div>
          </button>

          {/* Address badge pill */}
          <button 
            onClick={() => onNavigate('delivery')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-medium border border-emerald-200/60 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-gray-500 font-normal">Entregar en:</span>
            <span className="font-semibold max-w-[160px] truncate">{selectedAddress}</span>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar hamburguesas, sushi, fideos, leche..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100/80 focus:bg-white text-sm rounded-full border border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-hidden transition-all text-gray-800"
            />
          </div>
        </div>

        {/* Quick Nav Screens & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Navigation links for screens */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl text-xs font-medium text-gray-700">
            <button
              onClick={() => onNavigate('marketplace')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentScreen === 'marketplace'
                  ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                  : 'hover:text-emerald-700'
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentScreen === 'cart'
                  ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                  : 'hover:text-emerald-700'
              }`}
            >
              Carrito
            </button>
            <button
              onClick={() => onNavigate('delivery')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentScreen === 'delivery'
                  ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                  : 'hover:text-emerald-700'
              }`}
            >
              Entrega
            </button>
          </div>

          {/* Cart Trigger Button */}
          <button
            onClick={onOpenDrawer}
            className="relative flex items-center gap-2.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Canasta 360</span>
            <span className="bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-md font-mono text-[11px]">
              ${cartSubtotal.toLocaleString('es-CL')}
            </span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-bounce">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* User Account / Login */}
          {user ? (
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-emerald-300 bg-white text-xs font-medium text-gray-800 transition-colors cursor-pointer"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-emerald-200" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="hidden md:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-600 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
