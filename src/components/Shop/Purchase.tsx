
import { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCoins } from '@/hooks/useCoins';
import { useToast } from '@/hooks/use-toast';

interface ShopItem {
  id: string;
  name: string;
  duration: string;
  durationDays: number;
  price: number;
  description: string;
}

interface PurchaseProps {
  item: ShopItem;
  onClose: () => void;
}

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .regex(/^\+?[0-9\s\-()]+$/, { message: "Please enter a valid phone number" }),
});

type FormData = z.infer<typeof phoneSchema>;

const Purchase = ({ item, onClose }: PurchaseProps) => {
  const { spendCoins } = useCoins();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyGenerated, setKeyGenerated] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });
  
  const handlePurchase = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Attempt to spend coins
      const success = await spendCoins(item.price, item.name);
      
      if (success) {
        // Generate a random key
        const generatedKey = generateRandomKey();
        setKeyGenerated(generatedKey);
        
        // Send webhook
        sendWebhook(data.phoneNumber, item, generatedKey);
        
        toast({
          title: "Purchase successful!",
          description: `Your key for ${item.duration} has been generated`,
        });
      }
    } catch (error) {
      toast({
        title: "Purchase failed",
        description: "An error occurred while processing your purchase",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    
    // Generate a 16 character key with hyphens every 4 characters
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        key += '-';
      }
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return key;
  };
  
  const sendWebhook = (phoneNumber: string, item: ShopItem, key: string) => {
    // In a real application, you would make an API call to send the webhook
    console.log(`Webhook: User purchased ${item.name} with phone number ${phoneNumber}. Key: ${key}`);
    
    // Mockup of webhook data that would be sent
    const webhookData = {
      webhook_id: "1367344767188336641",
      content: `New Purchase: ${item.name}`,
      embeds: [
        {
          title: "Purchase Details",
          fields: [
            {
              name: "Item",
              value: item.name,
              inline: true
            },
            {
              name: "Duration",
              value: item.duration,
              inline: true
            },
            {
              name: "Price",
              value: `${item.price} coins`,
              inline: true
            },
            {
              name: "Phone Number",
              value: phoneNumber
            },
            {
              name: "Generated Key",
              value: key
            }
          ],
          color: 3066993
        }
      ]
    };
    
    // This is just a mockup, in a real app you'd make an actual fetch call to the webhook URL
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-spdm-dark border border-spdm-green/50 rounded-lg p-6 w-full max-w-md z-10 relative animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-spdm-green">
            Purchase {item.name}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-spdm-gray text-spdm-green transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {!keyGenerated ? (
          <form onSubmit={form.handleSubmit(handlePurchase)} className="space-y-4">
            <div>
              <div className="bg-spdm-gray p-4 rounded-md mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Item:</span>
                  <span className="text-white">{item.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{item.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-spdm-green font-bold">{item.price} coins</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-spdm-green">WhatsApp Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 123 456 7890"
                  className="bg-spdm-gray text-white border-spdm-green/30 focus:border-spdm-green"
                  {...form.register("phoneNumber")}
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{form.formState.errors.phoneNumber.message}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Enter your WhatsApp number with country code (e.g. +1 for US)
                </p>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-spdm-green hover:bg-spdm-darkGreen text-black font-medium" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Purchase"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Purchase Successful!</h3>
              <p className="text-gray-400">Your key has been generated and sent to admin for processing.</p>
            </div>
            
            <div className="bg-spdm-gray p-4 rounded-md mb-6">
              <p className="text-sm text-gray-400 mb-2">Your key:</p>
              <p className="text-lg font-mono bg-black p-2 rounded text-spdm-green break-all">
                {keyGenerated}
              </p>
            </div>
            
            <Button 
              onClick={onClose} 
              className="w-full bg-spdm-green hover:bg-spdm-darkGreen text-black font-medium"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchase;
