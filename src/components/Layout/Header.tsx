
import { useState } from 'react';
import { Menu } from 'lucide-react';
import SideMenu from './Menu';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="flex items-center">
        <div className="text-xl md:text-2xl font-bold tracking-wider text-spdm-green glow-text">
          SPDM
        </div>
      </div>
      
      <button 
        onClick={toggleMenu}
        className="flex items-center justify-center p-2 rounded-md hover:bg-spdm-gray transition-all duration-200"
        aria-label="Toggle menu"
      >
        <Menu size={24} className="text-spdm-green" />
      </button>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
};

export default Header;
