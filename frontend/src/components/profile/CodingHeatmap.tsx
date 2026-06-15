import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityCalendar } from 'react-activity-calendar';
import { useTheme } from 'next-themes';

interface CodingHeatmapProps {
  heatmapData: { date: string; count: number; level: number }[];
}

export default function CodingHeatmap({ heatmapData }: CodingHeatmapProps) {
  const { theme } = useTheme();

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-6">
        <div className="min-w-[700px] flex justify-center py-4">
          <ActivityCalendar 
            data={heatmapData.length > 0 ? heatmapData : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }]}
            theme={{
              light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
              dark: ['#1f2937', '#0e4429', '#006d32', '#26a641', '#39d353'],
            }}
            colorScheme={theme === 'light' ? 'light' : 'dark'}
            labels={{
              legend: {
                less: 'Less',
                more: 'More',
              },
              months: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ],
              totalCount: '{{count}} submissions in the last year',
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
