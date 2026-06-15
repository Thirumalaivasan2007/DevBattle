import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Award, Zap, Sword, Activity } from 'lucide-react';

interface ActivityFeedProps {
  activities: any[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ACCEPTED_PROBLEM': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'NEW_BADGE': return <Award className="h-5 w-5 text-yellow-500" />;
      case 'RATING_MILESTONE': return <Zap className="h-5 w-5 text-blue-500" />;
      case 'BATTLE_WIN': return <Sword className="h-5 w-5 text-purple-500" />;
      default: return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getActivityMessage = (activity: any) => {
    const meta = activity.metadata;
    switch (activity.activityType) {
      case 'ACCEPTED_PROBLEM': return `Solved problem "${meta?.problemTitle}"`;
      case 'NEW_BADGE': return `Earned badge "${meta?.badgeName}"`;
      case 'RATING_MILESTONE': return `Reached rating milestone ${meta?.rating}`;
      case 'BATTLE_WIN': return `Won a coding battle`;
      default: return 'Performed an activity';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities && activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1">{getActivityIcon(activity.activityType)}</div>
                <div>
                  <p className="text-sm font-medium">{getActivityMessage(activity)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No recent activity found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
