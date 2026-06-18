'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Swords, Trophy, Clock, History, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSocketStore } from '@/store/socketStore';
import { toast } from 'sonner';
import apiClient from '@/lib/axios';

export default function BattlesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { connect } = useSocketStore();
  const [isQueueing, setIsQueueing] = useState(false);

  // Ensure socket is connected globally
  React.useEffect(() => {
    connect();
  }, [connect]);

  const handleJoinQueue = async (type: 'RANKED' | 'UNRANKED') => {
    try {
      setIsQueueing(true);
      await apiClient.post('/battles/join-queue', { battleType: type });
      toast.success(`Joined ${type} queue! Searching for opponent...`);
    } catch (err: any) {
      setIsQueueing(false);
      toast.error(err.response?.data?.message || 'Failed to join queue');
    }
  };

  const handleLeaveQueue = async () => {
    try {
      await apiClient.post('/battles/leave-queue');
      setIsQueueing(false);
      toast.info('Left matchmaking queue');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to leave queue');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 flex items-center justify-center">
            <Swords className="w-12 h-12 mr-4 text-red-500" />
            Battle Arena
          </h1>
          <p className="text-xl text-muted-foreground">
            Face off against other developers in real-time coding matches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Ranked Battle */}
          <Card className="border-red-500/30 bg-gradient-to-br from-background to-red-950/20 shadow-xl shadow-red-900/10 hover:border-red-500/50 transition-colors">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold flex items-center justify-center text-red-500">
                <Trophy className="w-8 h-8 mr-2" /> Ranked Battle
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 pt-4">
              <p className="text-muted-foreground">
                Compete against players of similar skill. Win to gain Elo rating and climb the leaderboards!
              </p>
              
              <div className="text-2xl font-mono font-bold">
                Your Rating: <span className="text-primary">{user?.rating || 1000}</span>
              </div>

              {!isQueueing ? (
                <Button 
                  size="lg" 
                  className="w-full h-16 text-xl font-bold bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleJoinQueue('RANKED')}
                >
                  <Search className="w-6 h-6 mr-2 animate-pulse" /> Find Ranked Match
                </Button>
              ) : (
                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full h-16 text-xl font-bold border-red-500 text-red-500 animate-pulse"
                    disabled
                  >
                    Searching for opponent...
                  </Button>
                  <Button variant="ghost" onClick={handleLeaveQueue} className="w-full text-muted-foreground">
                    Cancel Matchmaking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unranked Battle */}
          <Card className="border-border/50 bg-card/40 backdrop-blur">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold flex items-center justify-center text-blue-500">
                <Clock className="w-8 h-8 mr-2" /> Casual Battle
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6 pt-4">
              <p className="text-muted-foreground">
                Practice your skills in a low-pressure environment. No ratings are on the line.
              </p>
              
              <div className="text-2xl font-mono font-bold invisible">
                Placeholder
              </div>

              <Button 
                size="lg" 
                variant="outline"
                className="w-full h-16 text-xl font-bold hover:bg-blue-500/10 hover:text-blue-500"
                onClick={() => handleJoinQueue('UNRANKED')}
                disabled={isQueueing}
              >
                Find Casual Match
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* History and Stats links */}
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={() => router.push('/battles/history')}>
            <History className="w-4 h-4 mr-2" /> View Battle History
          </Button>
        </div>
      </div>
    </div>
  );
}
