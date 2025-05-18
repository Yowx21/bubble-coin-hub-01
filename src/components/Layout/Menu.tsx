
import { useState } from 'react';
import { X, LogIn, UserPlus, Gift, ShoppingCart, RotateCw, AfkFarm } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const [authType, setAuthType] = useState<'login' | 'signup' | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const openAuth = (type: 'login' | 'signup') => {
    setAuthType(type);
  };

  const closeAuth = () => {
    setAuthType(null);
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleNavigate = (path: string) => {
    onClose();
    // Not navigating anywhere yet, but we could use React Router here
    console.log(`Navigating to ${path}`);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-80 backdrop-blur-menu z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div 
        className={`fixed top-0 right-0 w-full md:w-80 h-full bg-spdm-dark border-l border-spdm-green/30 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } p-6 flex flex-col`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-spdm-green glow-text">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-spdm-gray transition-colors"
          >
            <X className="text-spdm-green" size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-5">
          {!user ? (
            <>
              <button 
                onClick={() => openAuth('login')}
                className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
              >
                <LogIn className="mr-3 text-spdm-green" size={20} />
                <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Login</span>
              </button>
              
              <button 
                onClick={() => openAuth('signup')}
                className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
              >
                <UserPlus className="mr-3 text-spdm-green" size={20} />
                <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Sign Up</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavigate('/free-key')}
                className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
              >
                <Gift className="mr-3 text-spdm-green" size={20} />
                <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Free Key</span>
              </button>
              
              <button 
                onClick={() => handleNavigate('/shop')}
                className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
              >
                <ShoppingCart className="mr-3 text-spdm-green" size={20} />
                <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Shop</span>
              </button>

              <button 
                onClick={() => handleNavigate('/spin')}
                className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
              >
                <RotateCw className="mr-3 text-spdm-green" size={20} />
                <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Spin Wheel</span>
              </button>

              <button 
                onClick={() => handleNavigate('/afk-farm')}
                className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
              >
                <AfkFarm className="mr-3 text-spdm-green" size={20} />
                <span className="text-spdm-green group-hover:glow-text transition-all duration-200">AFK Farm</span>
              </button>
            </>
          )}
        </div>

        <div className="mt-auto space-y-4">
          <button
            onClick={() => openExternalLink('https://chat.whatsapp.com/KteLnsPOMEKIJw3I1phViP')}
            className="w-full p-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium flex justify-center items-center transition-all"
          >
            WhatsApp Community
          </button>
          
          <button
            onClick={() => openExternalLink('https://discord.gg/aJaKPWr42x')}
            className="w-full p-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex justify-center items-center transition-all"
          >
            Discord Server
          </button>
        </div>
      </div>

      <AuthModal isOpen={authType !== null} onClose={closeAuth} type={authType || 'login'} />
    </>
  );
};

export default SideMenu;
