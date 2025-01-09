import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

export interface LocationPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAllowLocation: () => void;
  onDenyLocation: () => void;
}

export const LocationPermissionDialog: React.FC<LocationPermissionDialogProps> = ({
  open,
  onOpenChange,
  onAllowLocation,
  onDenyLocation,
}) => {
  const handleAllowLocation = () => {
    onAllowLocation();
    onOpenChange(false);
  };

  const handleDenyLocation = () => {
    onDenyLocation();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl">Location Access</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-start space-x-3">
            <Navigation className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              Enable location access for accurate weather updates based on your current
              location.
            </p>
          </div>
          <div className="flex items-start space-x-3 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              If you prefer not to share your location, we&apos;ll show weather for our
              default location (New York, US).
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-between gap-3 mt-6">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleDenyLocation}
          >
            Maybe later
          </Button>
          <Button
            className="w-full sm:w-auto text-gray-50 bg-blue-600 hover:bg-blue-700"
            onClick={handleAllowLocation}
          >
            Allow location access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermissionDialog;
