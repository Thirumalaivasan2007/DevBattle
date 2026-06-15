import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Trophy, Star, Target, Code2, Flame, Award, CalendarDays, MapPin, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import TierBadge from '@/components/tier/TierBadge';

interface ProfileHeaderProps {
  user: any;
  stats: any;
}

export default function ProfileHeader({ user, stats }: ProfileHeaderProps) {
  if (!user) return null;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 shadow-xl overflow-hidden mb-6">
      <div className="h-32 bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40 relative">
        <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
          <Avatar className="h-full w-full">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback className="text-3xl text-primary font-bold">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardContent className="pt-16 pb-8 px-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <TierBadge rating={user.rating || user.highestRating || 1000} />
            </div>
            <p className="text-muted-foreground text-lg mb-2">@{user.username}</p>
            {user.bio && <p className="mt-2 text-sm text-muted-foreground max-w-md">{user.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
              </span>
              {user.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {user.country}
                </span>
              )}
              {user.collegeName && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {user.collegeName}
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="bg-card p-3 rounded-lg border border-border text-center">
              <Trophy className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
              <div className="text-xs text-muted-foreground">Rating</div>
              <div className="font-bold">{user.rating}</div>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border text-center">
              <Code2 className="h-5 w-5 mx-auto text-primary mb-1" />
              <div className="text-xs text-muted-foreground">Solved</div>
              <div className="font-bold">{user.solvedProblems}</div>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border text-center">
              <Flame className="h-5 w-5 mx-auto text-orange-500 mb-1" />
              <div className="text-xs text-muted-foreground">Max Streak</div>
              <div className="font-bold">{stats?.longestStreak || 0}</div>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border text-center">
              <Award className="h-5 w-5 mx-auto text-secondary mb-1" />
              <div className="text-xs text-muted-foreground">Badges</div>
              <div className="font-bold">{user.badgesCount || 0}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
