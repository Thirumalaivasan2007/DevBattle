"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Trophy, Swords, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useTeam } from './TeamContext';

export default function TeamOverviewPage() {
  const { team } = useTeam();
  if (!team) return null;

  const xpNeeded = team.level * 1000;
  const xpProgress = Math.min((team.xp / xpNeeded) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Team Progress</CardTitle>
            <CardDescription>Experience and leveling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Current Level</p>
                <div className="text-4xl font-extrabold text-primary">Lvl {team.level}</div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground mb-1">Experience</p>
                <div className="text-2xl font-bold">{team.xp} <span className="text-muted-foreground text-sm font-normal">/ {xpNeeded} XP</span></div>
              </div>
            </div>
            <Progress value={xpProgress} className="h-3" />
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>No achievements unlocked yet.</p>
              <p className="text-sm">Compete in contests and battles to earn team badges!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
                <p className="text-xl font-bold">{team.problemsSolved}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contests Joined</p>
                <p className="text-xl font-bold">{team.contestsParticipated}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Swords className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Battles Won</p>
                <p className="text-xl font-bold">{team.battlesWon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
