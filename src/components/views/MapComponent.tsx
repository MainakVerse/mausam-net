import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./dynamic-map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default MapComponent;
