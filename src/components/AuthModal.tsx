import React from 'react';
import { X, Lock, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLogin: () => void;
  onSelectRegister: () => void;
  onLoginWithGoogle: () => void;
  onLoginWithMicrosoft: () => void;
  onContinueAsGuest: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectLogin,
  onSelectRegister,
  onLoginWithGoogle,
  onLoginWithMicrosoft,
  onContinueAsGuest
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-emerald-950/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 text-center animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title & Copy */}
        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight leading-snug">
          ¡Casi listo! Inicia sesión para continuar tu compra
        </h3>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
          Guarda tus direcciones favoritas, acumula puntos Club 360 y recibe tus pedidos con seguimiento en tiempo real.
        </p>

        {/* Social Authentication: Google & Microsoft */}
        <div className="mt-6 space-y-2.5">
          <button
            onClick={onLoginWithGoogle}
            className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continuar con Google</span>
          </button>

          <button
            onClick={onLoginWithMicrosoft}
            className="w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 font-bold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
              <path fill="#f25022" d="M1 1h10v10H1z"/>
              <path fill="#00a4ef" d="M1 12h10v10H1z"/>
              <path fill="#7fba00" d="M12 1h10v10H12z"/>
              <path fill="#ffb900" d="M12 12h10v10H12z"/>
            </svg>
            <span>Continuar con Microsoft</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-2.5 text-[10px] text-gray-400 uppercase tracking-wider font-semibold absolute">
            o con tu correo
          </span>
        </div>

        {/* Email actions */}
        <div className="space-y-2">
          <button
            onClick={onSelectLogin}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Ingresar con Correo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onSelectRegister}
              className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Crear Cuenta
            </button>
            <button
              onClick={onContinueAsGuest}
              className="py-2 px-3 text-gray-500 hover:text-gray-800 font-medium text-xs rounded-xl transition-colors cursor-pointer"
            >
              Comprar como Invitado
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1 text-[10px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Datos protegidos con cifrado seguro SSL</span>
        </div>
      </div>
    </div>
  );
};
