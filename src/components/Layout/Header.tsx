
import { useState, useEffect } from 'react';
import { Menu, User, Users, ChevronDown, LogOut, Settings, Shield } from 'lucide-react';
import SideMenu from './Menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Online user type definition
interface OnlineUser {
  id: string;
  username: string;
  last_active: string;
  status: string;
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const isMobile = useIsMobile();
  const { user, logout, updatePresence } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Subscribe to online users
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('active_users')
          .select(`
            id,
            last_active,
            status,
            profiles!inner(username)
          `)
          .eq('status', 'online')
          .gt('last_active', new Date(Date.now() - 5 * 60000).toISOString());
        
        if (error) throw error;

        if (data) {
          const formattedUsers = data.map(item => ({
            id: item.id,
            username: (item.profiles as any).username,
            last_active: item.last_active,
            status: item.status
          }));

          setOnlineUsers(formattedUsers);
        }
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };

    // Initial fetch
    fetchOnlineUsers();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:active_users')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'active_users' 
        }, 
        () => {
          fetchOnlineUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Update presence when component mounts
    if (user) {
      updatePresence();
    }
  }, [user, updatePresence]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="flex items-center">
        <div className="text-xl md:text-2xl font-bold tracking-wider text-spdm-green glow-text">
          SPDM
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Online users indicator */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={() => setShowOnlineUsers(!showOnlineUsers)} 
              className="relative flex items-center justify-center p-2 rounded-full hover:bg-spdm-gray transition-all duration-200 active:scale-95"
            >
              <Users size={20} className="text-spdm-green" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {onlineUsers.length}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Online Users</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Online users dropdown */}
        {showOnlineUsers && (
          <div className="absolute top-16 right-20 bg-spdm-dark border border-spdm-green/30 rounded-lg shadow-lg p-3 min-w-[200px] max-h-[300px] overflow-y-auto animate-fade-in z-50">
            <h3 className="text-sm font-medium text-spdm-green mb-2">Online Users ({onlineUsers.length})</h3>
            <div className="space-y-2">
              {onlineUsers.length > 0 ? (
                onlineUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-300">{user.username}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No one is online</p>
              )}
            </div>
          </div>
        )}
        
        {/* User profile dropdown */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-spdm-gray/50 border border-spdm-green/20 hover:bg-spdm-gray transition-all duration-200 active:scale-95">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-spdm-green/20">
                <User size={16} className="text-spdm-green" />
              </div>
              <span className="text-sm text-gray-200 hidden md:inline">{user.username}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-spdm-dark border border-spdm-green/30 text-white min-w-[180px] animate-fade-in">
              <DropdownMenuLabel className="text-gray-400">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-spdm-green/20" />
              <DropdownMenuItem className="hover:bg-spdm-green/20 focus:bg-spdm-green/20 active:scale-98 transition-all cursor-pointer">
                <User size={16} className="mr-2 text-spdm-green" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-spdm-green/20 focus:bg-spdm-green/20 active:scale-98 transition-all cursor-pointer">
                <Settings size={16} className="mr-2 text-spdm-green" />
                <span>Settings</span>
              </DropdownMenuItem>
              
              {user.isAdmin && (
                <>
                  <DropdownMenuSeparator className="bg-spdm-green/20" />
                  <DropdownMenuItem className="hover:bg-spdm-green/20 focus:bg-spdm-green/20 active:scale-98 transition-all cursor-pointer">
                    <Shield size={16} className="mr-2 text-spdm-green" />
                    <span>Admin Panel</span>
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator className="bg-spdm-green/20" />
              <DropdownMenuItem 
                className="hover:bg-red-500/20 focus:bg-red-500/20 active:scale-98 transition-all cursor-pointer" 
                onClick={logout}
              >
                <LogOut size={16} className="mr-2 text-red-400" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        
        <button 
          onClick={toggleMenu}
          className="flex items-center justify-center p-2 rounded-md hover:bg-spdm-gray active:scale-95 transition-all duration-200"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-spdm-green" />
        </button>
      </div>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
};

export default Header;
