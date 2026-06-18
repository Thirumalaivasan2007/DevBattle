'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Coins, Crown, Image as ImageIcon, Frame, Palette, CheckCircle } from 'lucide-react';

export default function StorePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: storeItems, isLoading } = useQuery({
    queryKey: ['storeItems'],
    queryFn: async () => {
      const res = await apiClient.get('/gamification/store');
      return res.data;
    }
  });

  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await apiClient.get('/gamification/inventory');
      return res.data;
    },
    enabled: !!user
  });

  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiClient.post(`/gamification/store/purchase/${itemId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Item purchased successfully!');
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      // In a real app we might also refetch the user profile to update coin balance
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to purchase item');
    }
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'TITLE': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'FRAME': return <Frame className="w-5 h-5 text-blue-500" />;
      case 'THEME': return <Palette className="w-5 h-5 text-purple-500" />;
      default: return <ImageIcon className="w-5 h-5" />;
    }
  };

  const hasItem = (itemId: string) => {
    if (!inventory || !inventory.items) return false;
    return inventory.items.some((i: any) => i.storeItemId?._id === itemId || i.storeItemId === itemId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Reward Store</h1>
            <p className="text-muted-foreground">Spend your hard-earned coins on exclusive cosmetics and titles.</p>
          </div>
          {user && (
            <div className="flex items-center gap-2 bg-muted/50 border border-border/50 px-6 py-3 rounded-xl">
              <span className="text-muted-foreground font-medium">Your Balance:</span>
              <div className="flex items-center gap-1 font-bold text-xl text-amber-500">
                <Coins className="w-5 h-5" />
                {user.coins || 0}
              </div>
            </div>
          )}
        </div>

        {isLoading || invLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : storeItems?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border border-dashed rounded-lg">
            No items currently available in the store. Check back later!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeItems?.map((item: any) => (
              <Card key={item._id} className="bg-card/50 backdrop-blur border-border/50 flex flex-col overflow-hidden relative group">
                {item.rarity === 'LEGENDARY' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 pointer-events-none" />
                )}
                <CardHeader className="pb-4 relative">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-background/80 flex items-center gap-1">
                      {getIconForType(item.type)} {item.type}
                    </Badge>
                    <Badge variant={item.rarity === 'LEGENDARY' ? 'default' : item.rarity === 'EPIC' ? 'secondary' : 'outline'}>
                      {item.rarity}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 relative">
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50 flex justify-between items-center bg-muted/20">
                  <div className="flex items-center gap-1.5 font-bold text-amber-500 text-lg">
                    <Coins className="w-4 h-4" />
                    {item.price}
                  </div>
                  {hasItem(item._id) ? (
                    <Button disabled variant="outline" className="gap-2">
                      <CheckCircle className="w-4 h-4" /> Owned
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => purchaseMutation.mutate(item._id)} 
                      disabled={purchaseMutation.isPending || (user?.coins || 0) < item.price}
                      className={item.rarity === 'LEGENDARY' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600' : ''}
                    >
                      {purchaseMutation.isPending && purchaseMutation.variables === item._id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Purchase
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
