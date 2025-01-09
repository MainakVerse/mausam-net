import React from 'react';
import { CurrentWeatherResponse } from '@/types/weather';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Sun } from 'lucide-react';

interface DayDurationProps {
  data: CurrentWeatherResponse;
}

const DayDuration: React.FC<DayDurationProps> = ({ data }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sunrise = new Date(data.sys.sunrise * 1000);
  const sunset = new Date(data.sys.sunset * 1000);
  const dayLength = sunset.getTime() - sunrise.getTime();

  const chartData = [
    { time: sunrise.getTime(), value: 0 },
    { time: sunrise.getTime() + dayLength / 2, value: 1 },
    { time: sunset.getTime(), value: 0 },
  ];

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-4 w-4" /> Daylight Hours
        </CardTitle>
        <CardDescription>Track the day's light cycle and solar patterns</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sunGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FDB813" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FDB813" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(time) =>
                  new Date(time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
                tick={{ fontSize: 12 }}
              />
              <YAxis hide={true} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FDB813"
                fillOpacity={1}
                fill="url(#sunGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-sm mt-6">
          <div>
            <p className="font-semibold">{formatTime(data.sys.sunrise)}</p>
            <p className="text-muted-foreground">Sunrise</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatTime(data.sys.sunset)}</p>
            <p className="text-muted-foreground">Sunset</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DayDuration;
