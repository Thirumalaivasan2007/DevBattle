'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useSocketStore } from '@/store/socketStore';
import { useAuthStore } from '@/store/authStore';
import CodeEditor from '@/components/workspace/CodeEditor';
import { Button } from '@/components/ui/button';
import { Swords, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export default function BattleArenaPage() {
  const { id: battleId } = useParams();
  const router = useRouter();
  const { socket, isConnected } = useSocketStore();
  const { user } = useAuthStore();

  const [battle, setBattle] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [sourceCode, setSourceCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Fetch initial battle state
  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const res = await apiClient.get(`/battles/${battleId}`);
        const b = res.data;
        setBattle(b);
        
        const myData = b.participants.find((p: any) => p.userId._id === user?._id);
        const oppData = b.participants.find((p: any) => p.userId._id !== user?._id);
        
        setMe(myData);
        setOpponent(oppData);
        setIsReady(myData?.isReady);

        if (b.status === 'RUNNING') {
          const elapsed = Math.floor((new Date().getTime() - new Date(b.startTime).getTime()) / 1000);
          const totalDuration = b.duration * 60;
          setTimeRemaining(Math.max(0, totalDuration - elapsed));
        }
        
        if (b.status === 'FINISHED') {
          const winner = b.participants.find((p: any) => p.isWinner);
          if (winner) setWinnerId(winner.userId._id);
        }

      } catch (err) {
        toast.error('Failed to load battle');
      }
    };
    if (user) fetchBattle();
  }, [battleId, user]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !battleId || !user) return;

    socket.emit('join_battle', battleId);

    socket.on('battle:ready', (data) => {
      if (data.userId === opponent?.userId._id) {
        setOpponent((prev: any) => ({ ...prev, isReady: true }));
        toast.info('Opponent is ready!');
      }
    });

    socket.on('battle:start', (startedBattle) => {
      setBattle(startedBattle);
      setTimeRemaining(startedBattle.duration * 60);
      toast.success('Battle Started! GO!');
    });

    socket.on('battle:submission', (data) => {
      if (data.userId === opponent?.userId._id) {
        setOpponent((prev: any) => ({ ...prev, submissionCount: (prev.submissionCount || 0) + 1, passedCount: data.passedCount }));
        if (data.verdict === 'Accepted') {
           toast.error('Opponent solved the problem!');
        } else {
           toast.info(`Opponent submitted: ${data.verdict}`);
        }
      } else if (data.userId === user?._id) {
        setMe((prev: any) => ({ ...prev, submissionCount: (prev.submissionCount || 0) + 1, passedCount: data.passedCount }));
      }
    });

    socket.on('battle:end', (data) => {
      setBattle(data.battle);
      setWinnerId(data.winnerId);
      if (data.winnerId === user?._id) {
        toast.success('Victory! You won the battle!');
      } else if (data.winnerId) {
        toast.error('Defeat! Opponent won the battle.');
      } else {
        toast.info('Battle ended in a draw!');
      }
    });

    return () => {
      socket.emit('leave_battle', battleId);
      socket.off('battle:ready');
      socket.off('battle:start');
      socket.off('battle:submission');
      socket.off('battle:end');
    };
  }, [socket, battleId, opponent, user]);

  // Timer tick
  useEffect(() => {
    let interval: any;
    if (battle?.status === 'RUNNING' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [battle?.status, timeRemaining]);

  const handleReady = async () => {
    try {
      await apiClient.post(`/battles/${battleId}/ready`);
      setIsReady(true);
      setMe((prev: any) => ({ ...prev, isReady: true }));
    } catch (err) {
      toast.error('Failed to set ready status');
    }
  };

  const handleResign = async () => {
    if (confirm('Are you sure you want to resign? You will lose rating.')) {
      try {
        await apiClient.post(`/battles/${battleId}/resign`);
      } catch (err) {
        toast.error('Failed to resign');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsRunning(true);
      const res = await apiClient.post('/submissions/submit', {
        problemId: battle.problemId._id,
        sourceCode,
        language,
        battleId
      });
      setIsRunning(false);

      if (res.data.status === 'Accepted') {
        toast.success('Solution Accepted!');
      } else {
        toast.error(`Failed: ${res.data.status}`);
      }
    } catch (err: any) {
      setIsRunning(false);
      toast.error(err.response?.data?.message || 'Submission failed');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!battle) return <div className="min-h-screen pt-24 text-center">Loading Arena...</div>;

  const isBattleRunning = battle.status === 'RUNNING';
  const isBattleFinished = battle.status === 'FINISHED';
  const isWaiting = battle.status === 'WAITING_FOR_PLAYERS';

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 shrink-0 bg-card/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/battles')}><Swords className="w-4 h-4 mr-2"/> Arena</Button>
          <div className="font-bold text-lg">{battle.problemId.title}</div>
        </div>
        
        <div className="text-3xl font-mono font-bold text-primary animate-pulse">
          {formatTime(timeRemaining)}
        </div>

        <div className="flex items-center gap-4">
           {isBattleRunning && (
             <Button variant="destructive" onClick={handleResign}>Resign</Button>
           )}
        </div>
      </header>

      {/* Battle Status Bar */}
      <div className="h-20 border-b border-border/50 flex items-center justify-between px-12 shrink-0 bg-muted/20">
        {/* Me */}
        <div className="flex items-center gap-4 flex-1">
          <img src={me?.userId.avatar || '/default-avatar.png'} alt="Me" className="w-12 h-12 rounded-full border-2 border-primary" />
          <div>
            <div className="font-bold text-lg">{me?.userId.username} (You)</div>
            <div className="text-sm text-muted-foreground">Rating: {me?.userId.rating || 1000}</div>
            {isBattleRunning && <div className="text-sm text-muted-foreground">Submissions: {me?.submissionCount || 0}</div>}
          </div>
          {isWaiting && (
             <div className="ml-4">
               {isReady ? <span className="text-green-500 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Ready</span> : <Button size="sm" onClick={handleReady}>Ready Up</Button>}
             </div>
          )}
          {isBattleFinished && winnerId === me?.userId._id && <Trophy className="w-8 h-8 text-yellow-500 ml-4" />}
        </div>

        <div className="font-black text-4xl text-muted-foreground/30 px-8">VS</div>

        {/* Opponent */}
        <div className="flex items-center gap-4 flex-1 justify-end text-right">
          {isWaiting && (
             <div className="mr-4">
               {opponent?.isReady ? <span className="text-green-500 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> Ready</span> : <span className="text-muted-foreground flex items-center"><XCircle className="w-4 h-4 mr-1"/> Not Ready</span>}
             </div>
          )}
          {isBattleFinished && winnerId === opponent?.userId._id && <Trophy className="w-8 h-8 text-yellow-500 mr-4" />}
          <div>
            <div className="font-bold text-lg">{opponent?.userId.username || 'Opponent'}</div>
            <div className="text-sm text-muted-foreground">Rating: {opponent?.userId.rating || 1000}</div>
            {isBattleRunning && <div className="text-sm text-muted-foreground">Submissions: {opponent?.submissionCount || 0}</div>}
          </div>
          <img src={opponent?.userId.avatar || '/default-avatar.png'} alt="Opponent" className="w-12 h-12 rounded-full border-2 border-destructive" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem */}
        <div className="w-1/2 overflow-y-auto p-6 border-r border-border/50">
           {isBattleRunning || isBattleFinished ? (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-4">{battle.problemId.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: battle.problemId.description.replace(/\n/g, '<br/>') }} />
                
                <h3 className="text-xl font-bold mt-8 mb-2">Input Format</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">{battle.problemId.inputFormat}</div>
                
                <h3 className="text-xl font-bold mt-8 mb-2">Output Format</h3>
                <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">{battle.problemId.outputFormat}</div>

                <h3 className="text-xl font-bold mt-8 mb-2">Examples</h3>
                {battle.problemId.examples.map((ex: any, i: number) => (
                  <div key={i} className="bg-muted/30 p-4 rounded-md font-mono text-sm border border-border/50 mb-4">
                    <div className="mb-2"><span className="font-bold">Input:</span> <span className="text-muted-foreground whitespace-pre-wrap">{ex.input}</span></div>
                    <div className="mb-2"><span className="font-bold">Output:</span> <span className="text-muted-foreground whitespace-pre-wrap">{ex.output}</span></div>
                  </div>
                ))}
              </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Swords className="w-16 h-16 mb-4 opacity-50 animate-pulse" />
                <p className="text-xl">Waiting for both players to be ready...</p>
             </div>
           )}
        </div>

        {/* Right: Code Editor */}
        <div className="w-1/2 flex flex-col relative">
          {!isBattleRunning && !isBattleFinished && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur flex items-center justify-center">
              <p className="text-xl font-bold">Editor locked until battle starts</p>
            </div>
          )}
          <div className="flex-1 relative">
            <CodeEditor 
              sourceCode={sourceCode} 
              setSourceCode={setSourceCode} 
              language={language} 
              setLanguage={setLanguage} 
            />
          </div>
          <div className="h-16 border-t border-border/50 flex items-center justify-end px-6 bg-card shrink-0 gap-4">
            <Button variant="outline" disabled>Run Code</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isRunning || isBattleFinished}
              className="bg-primary hover:bg-primary/90 font-bold"
            >
              {isRunning ? 'Judging...' : 'Submit & Win'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
