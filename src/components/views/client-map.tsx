'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Droplets } from 'lucide-react';
import MapComponent from './MapComponent';

interface ClientMapProps {
  center: [number, number];
  zoom: number;
  markerPosition: [number, number];
  popupContent: string;
  title?: string;
  icon?: React.ReactNode;
  className?: string;
}

const ClientMap: React.FC<ClientMapProps> = ({
  center,
  zoom,
  markerPosition,
  popupContent,
  title = 'Precipitation Map',
  icon = <Droplets className="mr-2" />,
  className = 'col-span-full',
}) => {
  return (
    <Card className={`${className} flex flex-col h-[500px]`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow relative p-0">
        <div className="absolute inset-0 p-4">
          <MapComponent
            center={center}
            zoom={zoom}
            markerPosition={markerPosition}
            popupContent={popupContent}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientMap;
