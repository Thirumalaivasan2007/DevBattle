import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileStatsProps {
  stats: any;
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  if (!stats) return null;

  const acceptedCount = stats.acceptedCount || 0;
  const wrongAnswerCount = stats.wrongAnswerCount || 0;
  const runtimeErrors = stats.runtimeErrors || 0;
  const compilationErrors = stats.compilationErrors || 0;
  const easySolved = stats.easySolved || 0;
  const mediumSolved = stats.mediumSolved || 0;
  const hardSolved = stats.hardSolved || 0;

  const totalSubs = acceptedCount + wrongAnswerCount + runtimeErrors + compilationErrors;
  const accRate = totalSubs > 0 ? ((acceptedCount / totalSubs) * 100).toFixed(1) : '0.0';

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Performance Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Acceptance Rate</span>
            <span className="font-bold">{accRate}%</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Total Submissions</span>
            <span className="font-bold">{totalSubs}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Accepted</span>
            <span className="font-bold text-green-500">{acceptedCount}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Wrong Answers</span>
            <span className="font-bold text-red-500">{wrongAnswerCount}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-muted-foreground text-sm">Errors (RE/CE)</span>
            <span className="font-bold text-orange-500">{runtimeErrors + compilationErrors}</span>
          </div>
          
          <div className="mt-6 pt-4">
            <h4 className="text-sm font-semibold mb-3">Difficulty Breakdown</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-green-500">Easy</span>
                  <span>{easySolved}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-yellow-500">Medium</span>
                  <span>{mediumSolved}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-500">Hard</span>
                  <span>{hardSolved}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
