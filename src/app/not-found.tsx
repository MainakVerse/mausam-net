'use client';

import { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

const WEATHER_BACKGROUNDS = [
  { emoji: '⚡️', label: 'Lightning', position: 'top-20 left-20' },
  { emoji: '🌩️', label: 'Storm', position: 'top-32 right-24' },
  { emoji: '💨', label: 'Wind', position: 'bottom-24 left-32' },
  { emoji: '🌪️', label: 'Tornado', position: 'bottom-32 right-32' },
] as const;

const WeatherBackground = memo(() => (
  <div
    className="fixed inset-0 -z-10 pointer-events-none opacity-[0.07] dark:opacity-10"
    aria-hidden="true"
  >
    {WEATHER_BACKGROUNDS.map(({ emoji, label, position }, index) => (
      <div
        key={label}
        className={`absolute w-16 h-16 ${position} animate-float blur-[2px]`}
        style={{
          animationDelay: `${index * 0.7}s`,
          animationDuration: '4s',
        }}
        role="presentation"
        aria-hidden="true"
      >
        <span
          className="text-5xl transform hover:scale-110 transition-transform duration-300"
          aria-label={label}
        >
          {emoji}
        </span>
      </div>
    ))}
  </div>
));

WeatherBackground.displayName = 'WeatherBackground';

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleGoBack = () => {
    try {
      window.history.back();
    } catch (error) {
      router.push('/');
    }
  };

  if (!mounted) return null;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background"
      role="main"
      aria-labelledby="error-title"
    >
      <Card className="w-full max-w-md mx-auto bg-card/50 dark:bg-card/50 backdrop-blur-lg shadow-2xl animate-fade-in relative overflow-hidden border border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5 dark:from-yellow-500/10 dark:via-orange-500/10 dark:to-red-500/10 animate-gradient-x" />
        <CardContent className="p-8 relative z-10">
          <div className="text-center space-y-8">
            {/* Warning Icon with Glow Effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse-slow" />
              <AlertTriangle
                className="h-20 w-20 text-yellow-600 dark:text-yellow-400 mx-auto relative z-10 animate-bounce-gentle"
                aria-hidden="true"
              />
            </div>

            {/* Error Text */}
            <div className="space-y-3">
              <h1
                id="error-title"
                className="text-7xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 dark:from-yellow-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent"
                tabIndex={-1}
              >
                404
              </h1>
              <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-wrap">
              Oops! The weather seems unpredictable here. The page you're looking for
              doesn't exist or has been moved to a different location.
            </p>

            {/* Action Buttons */}
            <div
              className="flex flex-col sm:flex-row justify-center gap-4"
              role="navigation"
              aria-label="Error page navigation"
            >
              <Button
                asChild
                variant="default"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-500 dark:to-orange-500 hover:from-yellow-500 hover:to-orange-500 dark:hover:from-yellow-400 dark:hover:to-orange-400 text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 dark:hover:shadow-orange-400/20"
              >
                <Link
                  href="/"
                  className="min-w-[140px] flex items-center justify-center gap-2"
                  aria-label="Return to homepage"
                >
                  <Home className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Return Home</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Go Back</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <WeatherBackground />

      <div tabIndex={0} className="sr-only" aria-hidden="true">
        End of content
      </div>
    </main>
  );
}
