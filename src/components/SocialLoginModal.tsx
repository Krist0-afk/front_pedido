import React, { useState } from 'react';
import { X, Check, ArrowRight, User as UserIcon, Plus } from 'lucide-react';
import { User } from '../types';

interface SocialLoginModalProps {
  isOpen: boolean;
  provider: 'google' | 'microsoft' | null;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const SocialLoginModal: React.FC<SocialLoginModalProps> = ({
  isOpen,
  provider,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('primary');
  const [customEmail, setCustomEmail] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);

  if (!isOpen || !provider) return null;

  const handleSelectAccount = (userAccount: { name: string; email: string; avatar: string }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const user: User = {
        id: `usr-${provider}-${Date.now()}`,
        name: userAccount.name,
        email: userAccount.email,
        rut: '19.482.301-4',
        phone: '+56 9 8421 9932',
        isVerified: true,
        provider: provider,
        avatar: userAccount.avatar
      };
      onSuccess(user);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    const resolvedName = customName || customEmail.split('@')[0];
    handleSelectAccount({
      name: resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1),
      email: customEmail,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Provider Specific Header */}
        {provider === 'google' ? (
          <div className="p-6 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-semibold text-gray-800 text-sm">Google</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Elegir una cuenta
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              para continuar en <span className="font-semibold text-emerald-800">Pedidos 360</span>
            </p>
          </div>
        ) : (
          <div className="p-6 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 23 23">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                  <path fill="#7fba00" d="M12 1h10v10H12z"/>
                  <path fill="#ffb900" d="M12 12h10v10H12z"/>
                </svg>
                <span className="font-semibold text-gray-800 text-sm">Microsoft</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Iniciar sesión
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              con tu cuenta de Microsoft personal o educativa en <span className="font-semibold text-emerald-800">Pedidos 360</span>
            </p>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-gray-800">
                Iniciando sesión con {provider === 'google' ? 'Google' : 'Microsoft'}...
              </p>
              <span className="text-xs text-gray-400">Verificando credenciales</span>
            </div>
          ) : (
            <>
              {!showCustomInput ? (
                <>
                  {/* Account 1: User's actual email */}
                  <button
                    onClick={() => handleSelectAccount({
                      name: 'Matias Rodriguez',
                      email: 'microsoft2005yt@gmail.com',
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
                    })}
                    className="w-full p-3.5 rounded-2xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80" 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" 
                      />
                      <div className="truncate">
                        <div className="font-bold text-sm text-gray-900 group-hover:text-emerald-900">
                          Matias Rodriguez
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {provider === 'google' ? 'microsoft2005yt@gmail.com' : 'microsoft2005yt@outlook.com'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                      <span>Ingresar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Account 2: Alternative account */}
                  <button
                    onClick={() => handleSelectAccount({
                      name: 'Matias R. Silva',
                      email: provider === 'google' ? 'matias.rodriguez@gmail.com' : 'matias.rodriguez@live.cl',
                      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80'
                    })}
                    className="w-full p-3.5 rounded-2xl border border-gray-200 hover:border-emerald-600 hover:bg-emerald-50/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                        M
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-sm text-gray-900 group-hover:text-emerald-900">
                          Matias R. Silva
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {provider === 'google' ? 'matias.rodriguez@gmail.com' : 'matias.rodriguez@live.cl'}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                      <span>Ingresar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Use another account option */}
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full p-3 rounded-2xl border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex items-center gap-3 text-left transition-all cursor-pointer text-gray-700"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <Plus className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">
                      {provider === 'google' ? 'Usar otra cuenta de Google' : 'Usar otra cuenta de Microsoft'}
                    </span>
                  </button>
                </>
              ) : (
                /* Custom email input form */
                <form onSubmit={handleCustomSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {provider === 'google' ? 'Correo de Google (@gmail.com)' : 'Correo de Microsoft (@outlook, @hotmail)'}
                    </label>
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder={provider === 'google' ? 'usuario@gmail.com' : 'usuario@outlook.com'}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs outline-hidden"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Nombre (opcional)
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs outline-hidden"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Continuar
                    </button>
                  </div>
                </form>
              )}

              {/* Privacy note */}
              <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed">
                Para continuar, {provider === 'google' ? 'Google' : 'Microsoft'} compartirá tu nombre, dirección de correo electrónico y foto de perfil con <strong>Pedidos 360</strong>. Consulta la política de privacidad de la app.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
