
import { useAuth } from "@/hooks/useAuth";

const WalletDisplay = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="bg-spdm-gray border border-spdm-green/30 rounded-lg p-4 flex items-center justify-between shadow-lg animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-spdm-green/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-spdm-green">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-400">Wallet Balance</p>
          <p className="text-xl font-semibold text-white flex items-center">
            <span className="text-spdm-green mr-1 font-bold">{user.coins}</span> 
            coins
          </p>
        </div>
      </div>
      
      <div className="px-3 py-1 rounded-full bg-spdm-green/10 text-spdm-green text-xs font-medium border border-spdm-green/30">
        Active
      </div>
    </div>
  );
};

export default WalletDisplay;
