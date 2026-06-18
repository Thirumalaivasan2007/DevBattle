'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Crown, Image as ImageIcon, Frame, Palette, CheckCircle, PackageOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function InventoryPage() {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await apiClient.get('/gamification/inventory');
      return res.data;
    },
    enabled: isAuthenticated
  });

  const equipMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const res = await apiClient.post(`/gamification/inventory/equip/${itemId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Item equipped successfully!');
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to equip item');
    }
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Log in to view inventory</div>
        </div>
      </div>
    );
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'TITLE': return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'FRAME': return <Frame className="w-5 h-5 text-blue-500" />;
      case 'THEME': return <Palette className="w-5 h-5 text-purple-500" />;
      default: return <ImageIcon className="w-5 h-5" />;
    }
  };

  const isEquipped = (itemId: string, type: string) => {
    if (!inventory) return false;
    if (type === 'TITLE') return inventory.equippedTitle?._id === itemId || inventory.equippedTitle === itemId;
    if (type === 'FRAME') return inventory.equippedFrame?._id === itemId || inventory.equippedFrame === itemId;
    if (type === 'THEME') return inventory.equippedTheme?._id === itemId || inventory.equippedTheme === itemId;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">My Inventory</h1>
        <p className="text-muted-foreground mb-10">Manage your purchased cosmetics and equip titles to show off on your profile.</p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : !inventory || !inventory.items || inventory.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            <PackageOpen className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Your inventory is empty</p>
            <p className="text-sm mt-1">Visit the store to purchase exclusive items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.items.map((invItem: any) => {
              const item = invItem.storeItemId;
              if (!item) return null; // Saftey check if item was deleted from DB
              
              const equipped = isEquipped(item._id, item.type);
              
              return (
                <Card key={item._id} className={`bg-card/50 backdrop-blur border-border/50 flex flex-col relative transition-all ${equipped ? 'ring-2 ring-primary border-primary' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-background/80 flex items-center gap-1">
                        {getIconForType(item.type)} {item.type}
                      </Badge>
                      <Badge variant={item.rarity === 'LEGENDARY' ? 'default' : item.rarity === 'EPIC' ? 'secondary' : 'outline'}>
                        {item.rarity}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Acquired {formatDistanceToNow(new Date(invItem.acquiredAt))} ago</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/50 flex justify-end bg-muted/20">
                    {equipped ? (
                      <Button disabled variant="secondary" className="gap-2">
                        <CheckCircle className="w-4 h-4 text-success" /> Equipped
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => equipMutation.mutate(item._id)} 
                        disabled={equipMutation.isPending}
                        variant="outline"
                      >
                        {equipMutation.isPending && equipMutation.variables === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Equip
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
