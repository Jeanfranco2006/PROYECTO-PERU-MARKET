import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoPeruMarket from "../resources/img/logoPeruMarket.png";
import { authService, type LoginRequest } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Generar burbujas dinámicas
  const [bubbles, setBubbles] = useState([]);

  // Agrega esto en tu componente Login, después de los useState
useEffect(() => {
  // Verificar si el backend está disponible
  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/test');
      console.log('✅ Backend conectado:', response.status);
    } catch (error) {
      console.error('❌ Backend no disponible:', error);
    }
  };
  
  checkBackend();
}, []);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 20; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 100 + 40,
          left: Math.random() * 100,
          delay: Math.random() * 20,
          duration: Math.random() * 25 + 20,
          opacity: Math.random() * 0.15 + 0.05
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  const handleLogin = async () => {
    if (user === "" || pass === "") {
      setError("Por favor, complete todos los campos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Usar el servicio de autenticación para conectar con el backend
      const credentials: LoginRequest = {
        username: user,
        password: pass
      };

      const response = await authService.login(credentials);
      
      if (response.success) {
        // Guardar datos en localStorage
        authService.storeAuthData(response);
        
        // Guardar datos adicionales para compatibilidad
        localStorage.setItem("logged", "true");
        localStorage.setItem("username", response.user.username);
        
        navigate("/dashboard");
      } else {
        setError(response.message || "Credenciales incorrectas. Intente nuevamente.");
      }
    } catch (err: any) {
      console.error("Error en login:", err);
      setError(err.response?.data?.message || "Error de conexión con el servidor. Verifique que el backend esté ejecutándose.");
    } finally {
      setIsLoading(false);
    }   
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // El resto de tu código permanece igual...
  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      
      {/* Resplandor de fondo con colores Peru Market (dorado y verde) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/10 rounded-full blur-[150px] animate-pulse-slow"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-700/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-700/5 rounded-full blur-[140px]"></div>

      {/* Burbujas animadas con colores Peru Market */}
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full border animate-float"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              bottom: '-100px',
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
              opacity: bubble.opacity,
              background: `radial-gradient(circle at 30% 30%, rgba(180, 83, 9, ${bubble.opacity * 0.2}), rgba(21, 128, 61, ${bubble.opacity * 0.05}))`,
              borderColor: `rgba(217, 119, 6, ${bubble.opacity * 0.3})`,
              boxShadow: `0 0 ${bubble.size * 0.4}px rgba(217, 119, 6, ${bubble.opacity * 0.4}), inset 0 0 ${bubble.size * 0.2}px rgba(217, 119, 6, ${bubble.opacity * 0.2})`
            }}
          />
        ))}
      </div>

      {/* Partículas brillantes flotantes con colores del logo */}
      <div className="absolute w-2 h-2 bg-amber-500 rounded-full top-[15%] left-[20%] animate-twinkle shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
      <div className="absolute w-3 h-3 bg-yellow-600 rounded-full top-[25%] right-[15%] animate-twinkle-delayed shadow-[0_0_15px_rgba(202,138,4,0.8)]" style={{ animationDelay: '1s' }}></div>
      <div className="absolute w-2 h-2 bg-green-600 rounded-full bottom-[30%] left-[10%] animate-twinkle-delayed shadow-[0_0_10px_rgba(22,163,74,0.8)]" style={{ animationDelay: '2s' }}></div>
      <div className="absolute w-3 h-3 bg-amber-600 rounded-full top-[60%] right-[25%] animate-twinkle shadow-[0_0_15px_rgba(217,119,6,0.8)]"></div>

      {/* Contenedor principal con dos columnas */}
      <div className="relative z-10 w-full max-w-6xl flex items-center gap-16">
        
        {/* Columna izquierda - Formulario de Login */}
        <div className="flex-1 max-w-md">
          
          {/* Resplandor neón detrás de la tarjeta con color dorado */}
          <div className="absolute inset-0 bg-amber-600/20 rounded-[3rem] blur-3xl transform scale-105"></div>
          
          <div className="relative bg-white/95 backdrop-blur-xl p-12 rounded-[3rem] shadow-[0_0_60px_rgba(217,119,6,0.3),0_20px_60px_rgba(0,0,0,0.4)] transform transition-all duration-500 hover:shadow-[0_0_80px_rgba(217,119,6,0.4)]">
            
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-black bg-gradient-to-r from-amber-700 via-yellow-700 to-amber-600 bg-clip-text text-transparent mb-2">
                Peru Market
              </h2>
              <p className="text-gray-600 text-sm font-medium">Sistema de Gestión Empresarial</p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm text-center animate-shake flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Formulario */}
            <div className="space-y-5">
              
              {/* Campo Usuario con icono color vino/marrón */}
              <div className="relative group">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-amber-900 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Usuario"
                  className="w-full pl-20 pr-5 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all duration-300 text-base"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
              </div>

              {/* Campo Password con icono color vino/marrón */}
              <div className="relative group">
                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-amber-900 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="w-full pl-20 pr-14 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all duration-300 text-base"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Recordarme y Olvidaste contraseña */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center text-gray-600 text-sm cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2 cursor-pointer" 
                  />
                  <span className="ml-2 group-hover:text-amber-700 transition-colors font-medium">Recordarme</span>
                </label>
                
                <a href="#" className="text-sm text-gray-400 hover:text-amber-600 transition-colors font-medium">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón de Login con colores Peru Market */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="relative w-full bg-gradient-to-r from-amber-600 via-yellow-700 to-amber-700 text-white py-5 rounded-full font-bold text-base hover:from-amber-500 hover:via-yellow-600 hover:to-amber-600 hover:shadow-[0_10px_40px_rgba(217,119,6,0.5)] focus:outline-none transition-all duration-300 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-[0_10px_30px_rgba(217,119,6,0.4)] uppercase tracking-wide"
              >
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="relative z-10">Verificando...</span>
                  </>
                ) : (
                  <span className="relative z-10">Iniciar Sesión</span>
                )}
              </button>
            </div>

            {/* Footer con información de seguridad */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Conexión segura y encriptada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - SOLO LOGO E IMAGEN */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Logo grande con efecto de resplandor */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Resplandor dorado detrás del logo */}
                <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-3xl scale-110 animate-pulse-slow"></div>
                
                {/* Logo */}
                <div className="relative w-80 h-80 rounded-full flex items-center justify-center shadow-2xl bg-white/10 backdrop-blur-sm p-8 border-4 border-amber-500/30">
                  <img 
                    src={logoPeruMarket} 
                    alt="Peru Market" 
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Texto debajo del logo */}
            <div className="space-y-3">
              <h1 className="text-5xl font-black bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent drop-shadow-lg">
                Peru Market
              </h1>
              <p className="text-xl text-gray-300 font-medium">
                Sistema de Gestión Empresarial
              </p>
              <div className="flex justify-center">
                <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full shadow-lg shadow-amber-500/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-50vh) rotate(180deg) scale(1.1);
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg) scale(0.8);
            opacity: 0;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-twinkle-delayed {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}