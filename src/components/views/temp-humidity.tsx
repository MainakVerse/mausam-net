'use client';

import React, { useMemo, memo } from 'react';
import { ForecastResponse } from '@/types/weather';
import { Thermometer, Droplets } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TemperatureHumidityChartProps {
  data: ForecastResponse;
  unit: 'metric' | 'imperial';
}

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

const chartConfig = {
  temperature: {
    label: 'Temperature',
    color: 'hsl(var(--chart-1))',
  },
  humidity: {
    label: 'Humidity',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type CustomTooltipProps = TooltipProps<number, string> & {
  temperatureUnit: string;
};

const TooltipContent = memo(
  ({ active, payload, temperatureUnit }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm" role="tooltip">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[var(--color-temperature)]" />
            <span className="text-sm font-medium">
              {payload[0]?.value?.toFixed(1)}
              {temperatureUnit}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[var(--color-humidity)]" />
            <span className="text-sm font-medium">{payload[1]?.value}%</span>
          </div>
        </div>
      </div>
    );
  },
);
TooltipContent.displayName = 'TooltipContent';

interface ChartComponentProps {
  chartData: ChartDataPoint[];
  temperatureUnit: string;
}

const ChartComponent = memo(({ chartData, temperatureUnit }: ChartComponentProps) => {
  const timeFormatter = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp));
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={chartConfig}>
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          aria-label="Temperature and humidity forecast chart"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={timeFormatter}
          />
          <YAxis
            yAxisId="temp"
            orientation="left"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}${temperatureUnit}`}
          />
          <YAxis
            yAxisId="humidity"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}%`}
          />
          <ChartTooltip
            cursor={false}
            content={(props: any) => (
              <TooltipContent {...props} temperatureUnit={temperatureUnit} />
            )}
          />
          <defs>
            <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-temperature)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-temperature)" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-humidity)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-humidity)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            stroke="var(--color-temperature)"
            fill="url(#temperatureGradient)"
            fillOpacity={0.4}
            aria-label="Temperature trend line"
            isAnimationActive={true}
          />
          <Area
            yAxisId="humidity"
            type="monotone"
            dataKey="humidity"
            stroke="var(--color-humidity)"
            fill="url(#humidityGradient)"
            fillOpacity={0.4}
            aria-label="Humidity trend line"
            isAnimationActive={true}
          />
        </AreaChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
});
ChartComponent.displayName = 'ChartComponent';

interface LegendProps {
  temperatureUnit: string;
}

const Legend = memo(({ temperatureUnit }: LegendProps) => (
  <div className="flex justify-between mt-4 text-sm w-full" role="legend">
    <div className="flex items-center gap-2">
      <Thermometer className="h-4 w-4 text-[var(--color-temperature)]" />
      <span className="text-muted-foreground">Temperature ({temperatureUnit})</span>
    </div>
    <div className="flex items-center gap-2">
      <Droplets className="h-4 w-4 text-[var(--color-humidity)]" />
      <span className="text-muted-foreground">Humidity (%)</span>
    </div>
  </div>
));
Legend.displayName = 'Legend';

const TemperatureHumidityChart = memo(({ data, unit }: TemperatureHumidityChartProps) => {
  const temperatureUnit = unit === 'metric' ? '°C' : '°F';

  const chartData = useMemo(
    (): ChartDataPoint[] =>
      data.list.map((item) => ({
        time: (item.dt * 1000).toString(),
        temperature: Math.round(item.main.temp * 10) / 10,
        humidity: item.main.humidity,
      })),
    [data.list],
  );

  return (
    <Card className="md:col-span-2 w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-4 w-4" />
          Temperature and Humidity Forecast
        </CardTitle>
        <CardDescription>Weather conditions for the next few days</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="w-full h-[250px]">
          <div className="block md:hidden">
            <ScrollArea className="w-full">
              <div className="min-w-[600px] h-[250px]">
                <ChartComponent chartData={chartData} temperatureUnit={temperatureUnit} />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="hidden md:block h-full">
            <ChartComponent chartData={chartData} temperatureUnit={temperatureUnit} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Legend temperatureUnit={temperatureUnit} />
      </CardFooter>
    </Card>
  );
});
TemperatureHumidityChart.displayName = 'TemperatureHumidityChart';

export default TemperatureHumidityChart;
