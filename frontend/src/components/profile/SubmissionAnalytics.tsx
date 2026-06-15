import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SubmissionAnalyticsProps {
  stats: any;
}

export default function SubmissionAnalytics({ stats }: SubmissionAnalyticsProps) {
  if (!stats) return null;

  const data = [
    { name: 'Accepted', value: stats.acceptedCount, color: '#10b981' },
    { name: 'Wrong Answer', value: stats.wrongAnswerCount, color: '#ef4444' },
    { name: 'Runtime Error', value: stats.runtimeErrors, color: '#f97316' },
    { name: 'Compile Error', value: stats.compilationErrors, color: '#eab308' },
  ].filter(d => d.value > 0);

  // Convert languageUsage Map/Object to Array
  let langData: any[] = [];
  if (stats.languageUsage) {
    langData = Object.keys(stats.languageUsage).map(key => ({
      name: key,
      value: stats.languageUsage[key]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // top 5
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'];

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
          <div className="h-full flex flex-col items-center">
            <h4 className="text-sm text-muted-foreground font-medium mb-2">Verdicts</h4>
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No submissions yet</div>
            )}
          </div>
          
          <div className="h-full flex flex-col items-center">
            <h4 className="text-sm text-muted-foreground font-medium mb-2">Top Languages</h4>
            {langData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={langData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {langData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No language data</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
