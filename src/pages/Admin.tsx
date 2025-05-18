import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Define interfaces to handle types properly
interface UserItem {
  id: string;
  username: string;
  is_admin: boolean;
  is_owner: boolean;
  email: string;
  balance: number;
}

interface WalletData {
  user_id: string;
  balance: number;
}

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [coinAmount, setCoinAmount] = useState<number>(0);

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin && !user.isOwner) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
    }
  }, [user, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.isAdmin && !user?.isOwner) return;

      setLoading(true);
      try {
        // Using a simpler query approach to avoid TypeScript errors
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, is_admin, is_owner');
          
        if (profilesError) throw profilesError;
        
        // Get user emails - Direct query instead of RPC
        const { data: authData } = await supabase.auth.admin.listUsers();
        const usersData = authData?.users || [];
        
        // Get wallet balances - use type assertion for now
        let walletsData: WalletData[] = [];
        try {
          const { data, error } = await supabase
            .from('wallets')
            .select('user_id, balance');
            
          if (!error && data) {
            walletsData = data as WalletData[];
          }
        } catch (error) {
          console.error('Error fetching wallets:', error);
        }
          
        // Combine the data
        const formattedUsers = profilesData.map(profile => {
          const userData = usersData.find(u => u.id === profile.id);
          const userEmail = userData?.email || '';
          const userBalance = walletsData?.find(w => w.user_id === profile.id)?.balance || 0;
          
          return {
            id: profile.id,
            username: profile.username,
            is_admin: profile.is_admin || false,
            is_owner: profile.is_owner || false,
            email: userEmail,
            balance: userBalance
          };
        });
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleAddCoins = async () => {
    if (!selectedUser || coinAmount === 0) return;
    
    try {
      const { error } = await supabase.rpc('update_user_balance', {
        target_user_id: selectedUser,
        amount_change: coinAmount
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Added ${coinAmount} coins to the user's balance`,
      });
      
      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === selectedUser 
            ? { ...u, balance: u.balance + coinAmount } 
            : u
        )
      );
      
      setCoinAmount(0);
    } catch (error) {
      console.error('Error adding coins:', error);
      toast({
        title: "Error",
        description: "Failed to add coins",
        variant: "destructive",
      });
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Direct query instead of RPC
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `User admin status updated successfully`,
      });
      
      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId 
            ? { ...u, is_admin: !u.is_admin } 
            : u
        )
      );
      
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  const toggleOwnerStatus = async (userId: string, currentStatus: boolean) => {
    if (!user?.isOwner) {
      toast({
        title: "Access Denied",
        description: "Only owners can change owner status",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_owner: !currentStatus })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `User owner status updated successfully`,
      });
      
      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId 
            ? { ...u, is_owner: !u.is_owner } 
            : u
        )
      );
      
    } catch (error) {
      console.error('Error updating owner status:', error);
      toast({
        title: "Error",
        description: "Failed to update owner status",
        variant: "destructive",
      });
    }
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (!user || (!user.isAdmin && !user.isOwner)) {
    return (
      <div className="min-h-screen bg-spdm-black text-white">
        <Header />
        <div className="pt-24 pb-20 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spdm-black text-white">
      <Header />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold mb-6 text-spdm-green glow-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Admin Panel
          </motion.h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spdm-green"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <motion.div
                className="bg-spdm-gray border border-spdm-green/30 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-white">Manage Users</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b border-spdm-green/30">
                      <tr>
                        <th className="px-4 py-3 text-spdm-green">Username</th>
                        <th className="px-4 py-3 text-spdm-green">Email</th>
                        <th className="px-4 py-3 text-spdm-green">Balance</th>
                        <th className="px-4 py-3 text-spdm-green">Admin</th>
                        {user.isOwner && (
                          <th className="px-4 py-3 text-spdm-green">Owner</th>
                        )}
                        <th className="px-4 py-3 text-spdm-green">Actions</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {users.map((userItem) => (
                        <motion.tr 
                          key={userItem.id} 
                          className="border-b border-spdm-green/10 hover:bg-spdm-green/5 transition-colors"
                          variants={itemVariants}
                        >
                          <td className="px-4 py-3">{userItem.username}</td>
                          <td className="px-4 py-3">{userItem.email}</td>
                          <td className="px-4 py-3">{userItem.balance} coins</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${userItem.is_admin ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                              {userItem.is_admin ? 'Yes' : 'No'}
                            </span>
                          </td>
                          {user.isOwner && (
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${userItem.is_owner ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {userItem.is_owner ? 'Yes' : 'No'}
                              </span>
                            </td>
                          )}
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-spdm-green/30 hover:bg-spdm-green/10 text-spdm-green"
                                onClick={() => setSelectedUser(userItem.id)}
                              >
                                Add Coins
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className={userItem.is_admin 
                                  ? "border-red-500/30 hover:bg-red-500/10 text-red-400"
                                  : "border-green-500/30 hover:bg-green-500/10 text-green-400"
                                }
                                onClick={() => toggleAdminStatus(userItem.id, userItem.is_admin)}
                              >
                                {userItem.is_admin ? 'Remove Admin' : 'Make Admin'}
                              </Button>
                              {user.isOwner && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className={userItem.is_owner 
                                    ? "border-purple-500/30 hover:bg-purple-500/10 text-purple-400"
                                    : "border-blue-500/30 hover:bg-blue-500/10 text-blue-400"
                                  }
                                  onClick={() => toggleOwnerStatus(userItem.id, userItem.is_owner)}
                                >
                                  {userItem.is_owner ? 'Remove Owner' : 'Make Owner'}
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              </motion.div>
              
              {selectedUser && (
                <motion.div
                  className="bg-spdm-gray border border-spdm-green/30 rounded-lg p-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                >
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    Add Coins to {users.find(u => u.id === selectedUser)?.username}
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={coinAmount || ''}
                        onChange={(e) => setCoinAmount(parseInt(e.target.value) || 0)}
                        className="bg-spdm-dark text-white border-spdm-green/30"
                      />
                    </div>
                    <Button 
                      onClick={handleAddCoins}
                      className="bg-spdm-green hover:bg-spdm-darkGreen text-black font-medium"
                      disabled={coinAmount === 0}
                    >
                      Add Coins
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedUser(null)}
                      className="border-spdm-green/30 hover:bg-spdm-green/10 text-spdm-green"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
