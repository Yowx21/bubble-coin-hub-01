
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus, Gift, ShoppingCart, RotateCw, Timer, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const SideMenu = ({ isOpen, onClose, onLoginClick, onSignupClick }: SideMenuProps) => {
  const [authType, setAuthType] = useState<'login' | 'signup' | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const openAuth = (type: 'login' | 'signup') => {
    if (onLoginClick && type === 'login') {
      onLoginClick();
      onClose();
      return;
    }
    
    if (onSignupClick && type === 'signup') {
      onSignupClick();
      onClose();
      return;
    }
    
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
    navigate(path);
  };

  // Animation variants
  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } }
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };
  
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.3 
      }
    }),
    tap: { scale: 0.97 }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-menu z-50"
            onClick={onClose}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed top-0 right-0 w-full md:w-80 h-full bg-spdm-dark border-l border-spdm-green/30 z-50 p-6 flex flex-col"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-spdm-green glow-text">Menu</h2>
              <motion.button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-spdm-gray transition-colors"
                whileTap={{ scale: 0.9, rotate: -90 }}
                whileHover={{ rotate: -15 }}
              >
                <X className="text-spdm-green" size={24} />
              </motion.button>
            </div>

            <div className="flex flex-col space-y-5">
              {!user ? (
                <>
                  <motion.button 
                    onClick={() => openAuth('login')}
                    className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
                    variants={buttonVariants}
                    custom={0}
                    initial="initial"
                    animate="animate"
                    whileTap="tap"
                  >
                    <LogIn className="mr-3 text-spdm-green" size={20} />
                    <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Login</span>
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => openAuth('signup')}
                    className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
                    variants={buttonVariants}
                    custom={1}
                    initial="initial"
                    animate="animate"
                    whileTap="tap"
                  >
                    <UserPlus className="mr-3 text-spdm-green" size={20} />
                    <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Sign Up</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button 
                    onClick={() => handleNavigate('/free-key')}
                    className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
                    variants={buttonVariants}
                    custom={0}
                    initial="initial"
                    animate="animate"
                    whileTap="tap"
                  >
                    <Gift className="mr-3 text-spdm-green" size={20} />
                    <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Free Key</span>
                  </motion.button>
                  
                  <motion.button 
                    onClick={() => handleNavigate('/shop')}
                    className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
                    variants={buttonVariants}
                    custom={1}
                    initial="initial"
                    animate="animate"
                    whileTap="tap"
                  >
                    <ShoppingCart className="mr-3 text-spdm-green" size={20} />
                    <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Shop</span>
                  </motion.button>

                  <motion.button 
                    onClick={() => handleNavigate('/spin')}
                    className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
                    variants={buttonVariants}
                    custom={2}
                    initial="initial"
                    animate="animate"
                    whileTap="tap"
                  >
                    <RotateCw className="mr-3 text-spdm-green" size={20} />
                    <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Spin Wheel</span>
                  </motion.button>

                  <motion.button 
                    onClick={() => handleNavigate('/afk-farm')}
                    className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
                    variants={buttonVariants}
                    custom={3}
                    initial="initial"
                    animate="animate"
                    whileTap="tap"
                  >
                    <Timer className="mr-3 text-spdm-green" size={20} />
                    <span className="text-spdm-green group-hover:glow-text transition-all duration-200">AFK Farm</span>
                  </motion.button>
                  
                  {user.isAdmin && (
                    <motion.button 
                      onClick={() => handleNavigate('/admin')}
                      className="flex items-center p-3 rounded-md hover:bg-spdm-gray transition-all duration-200 border border-spdm-green/50 hover:border-spdm-green group"
                      variants={buttonVariants}
                      custom={4}
                      initial="initial"
                      animate="animate"
                      whileTap="tap"
                    >
                      <Shield className="mr-3 text-spdm-green" size={20} />
                      <span className="text-spdm-green group-hover:glow-text transition-all duration-200">Admin Panel</span>
                    </motion.button>
                  )}
                </>
              )}
            </div>

            <div className="mt-auto space-y-4">
              <motion.button
                onClick={() => openExternalLink('https://chat.whatsapp.com/KteLnsPOMEKIJw3I1phViP')}
                className="w-full p-3 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium flex justify-center items-center transition-all"
                variants={buttonVariants}
                custom={user ? 5 : 2}
                initial="initial"
                animate="animate"
                whileTap="tap"
              >
                WhatsApp Community
              </motion.button>
              
              <motion.button
                onClick={() => openExternalLink('https://discord.gg/aJaKPWr42x')}
                className="w-full p-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex justify-center items-center transition-all"
                variants={buttonVariants}
                custom={user ? 6 : 3}
                initial="initial"
                animate="animate"
                whileTap="tap"
              >
                Discord Server
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {authType !== null && !onLoginClick && !onSignupClick && (
        <AuthModal isOpen={authType !== null} onClose={closeAuth} type={authType || 'login'} />
      )}
    </>
  );
};

export default SideMenu;
