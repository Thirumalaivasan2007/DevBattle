import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface AchievementGridProps {
  achievements: any[];
}

export default function AchievementGrid({ achievements }: AchievementGridProps) {
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {achievements && achievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {achievements.map((ach) => (
              <div 
                key={ach._id} 
                className="flex flex-col items-center p-4 bg-card rounded-lg border border-border/50 hover:border-primary/50 transition-colors text-center"
                title={ach.description}
              >
                <div className="text-4xl mb-3">{ach.badgeIcon}</div>
                <h4 className="text-sm font-bold leading-tight mb-1">{ach.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(ach.unlockedAt), 'MMM d, yyyy')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No achievements unlocked yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
