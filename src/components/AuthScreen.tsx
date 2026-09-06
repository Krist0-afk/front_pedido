import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  User, 
  Zap, 
  Clock, 
  MapPin, 
  Award,
  Package,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { User as UserType } from '../types';
import { INITIAL_USER } from '../data/mockData';

interface AuthScreenProps {
  currentUser: UserType | null;
  onLoginSuccess: (user: UserType) => void;
  onLogout: () => void;
  onContinueShopping: () => void;
  onTriggerSocialLogin: (provider: 'google' | 'microsoft') => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onContinueShopping,
  onTriggerSocialLogin
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('matias.rodriguez@email.com');
  const [password, setPassword] = useState<string>('********');
  const [name, setName] = useState<string>('Matías Rodríguez');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser: UserType = {
      id: currentUser ? currentUser.id : `usr-${Date.now()}`,
      name: activeTab === 'register' ? name : (currentUser ? currentUser.name : 'Matías Rodríguez Silva'),
      email: email,
      rut: '19.482.301-4',
      phone: '+56 9 8421 9932',
      isVerified: true,
      provider: 'email',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
    };
    onLoginSuccess(loggedUser);
  };

  const handleQuickDemo = () => {
    onLoginSuccess({
      ...INITIAL_USER,
      provider: 'email'
    });
  };

  if (currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
          {/* Header Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100 text-center sm:text-left">
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md shrink-0" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 text-2xl font-bold flex items-center justify-center shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {currentUser.name}
                </h2>
                {currentUser.provider === 'google' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Cuenta Google
                  </span>
                )}
                {currentUser.provider === 'microsoft' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200">
                    <svg className="w-3 h-3" viewBox="0 0 23 23">
                      <path fill="#f25022" d="M1 1h10v10H1z"/>
                      <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                      <path fill="#7fba00" d="M12 1h10v10H12z"/>
                      <path fill="#ffb900" d="M12 12h10v10H12z"/>
                    </svg>
                    Cuenta Microsoft
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs">{currentUser.email}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cuenta Verificada
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> Miembro Club 360 Platinum
                </span>
              </div>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs">
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <span className="text-gray-400 block mb-1">RUT Registrado</span>
              <span className="font-bold text-gray-800">{currentUser.rut || '19.482.301-4'}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <span className="text-gray-400 block mb-1">Teléfono Móvil</span>
              <span className="font-bold text-gray-800">{currentUser.phone || '+56 9 8421 9932'}</span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <span className="text-gray-400 block mb-1">Dirección de Entrega Predeterminada</span>
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Av. Providencia 1245, Depto 402
              </span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <span className="text-gray-400 block mb-1">Beneficio Activo</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Envíos Gratis Ilimitados por 30 días
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onContinueShopping}
              className="flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explorar Catálogo</span>
            </button>
            <button
              onClick={onLogout}
              className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand & Value Prop */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-emerald-950 font-black text-lg shadow-md">
                360°
              </div>
              <div>
                <div className="font-extrabold text-xl tracking-tight leading-none text-white">
                  Pedidos<span className="text-emerald-300">360</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-200 uppercase tracking-wider">
                  Delivery & Market
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Tus antojos y compras en minutos con Pedidos 360
            </h2>
            <p className="text-emerald-100 text-xs mt-3 leading-relaxed">
              La única aplicación que combina los mejores restaurantes gastronómicos y Dark Stores de supermercado con entrega rápida garantizada.
            </p>

            {/* Feature Value Pills */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-400 text-emerald-950 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Envío Ultra Rápido</h4>
                  <p className="text-[11px] text-emerald-200">Entregas promedio en 25 minutos con repartidores certificados.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-400 text-emerald-950 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Restaurantes & Súper juntos</h4>
                  <p className="text-[11px] text-emerald-200">Un solo repartidor, una sola tarifa de servicio combinada.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-400 text-emerald-950 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Inicio de Sesión Seguro</h4>
                  <p className="text-[11px] text-emerald-200">Accede instantáneamente con tu cuenta de Google o Microsoft.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-emerald-700/50 text-[11px] text-emerald-300 flex items-center justify-between">
            <span>© Pedidos 360 SpA</span>
            <span>Garantía de Satisfacción</span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Tab switchers */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`text-base font-extrabold pb-2 transition-all cursor-pointer relative ${
                    activeTab === 'login'
                      ? 'text-emerald-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-700'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`text-base font-extrabold pb-2 transition-all cursor-pointer relative ${
                    activeTab === 'register'
                      ? 'text-emerald-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-700'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>

              {/* Demo button */}
              <button
                onClick={handleQuickDemo}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                ⚡ Ingreso Rápido Demo
              </button>
            </div>

            {/* Social Logins: GOOGLE & MICROSOFT */}
            <div className="space-y-2.5 mb-6">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => onTriggerSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-800 shadow-2xs transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continuar con Google</span>
              </button>

              {/* Microsoft Button */}
              <button
                type="button"
                onClick={() => onTriggerSocialLogin('microsoft')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-800 shadow-2xs transition-all cursor-pointer group"
              >
                <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 23 23">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                  <path fill="#7fba00" d="M12 1h10v10H12z"/>
                  <path fill="#ffb900" d="M12 12h10v10H12z"/>
                </svg>
                <span>Continuar con Microsoft</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider font-semibold absolute">
                o con tu correo
              </span>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Nombre y Apellido
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Matías Rodríguez"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600 outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">Contraseña</label>
                  {activeTab === 'login' && (
                    <a href="#" className="text-[11px] text-emerald-700 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-emerald-600 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <span>Mantener sesión iniciada</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>{activeTab === 'login' ? 'Iniciar Sesión en Pedidos 360' : 'Crear Mi Cuenta Gratuita'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            {activeTab === 'login' ? (
              <span>
                ¿Eres nuevo en Pedidos 360?{' '}
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Registrarme
                </button>
              </span>
            ) : (
              <span>
                ¿Ya tienes una cuenta creada?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

