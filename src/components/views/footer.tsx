import React, { memo } from 'react';
import { Github } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface FooterProps {
  className?: string;
  authorName?: string;
  githubUsername?: string;
  repoUrl?: string;
}

const Footer = memo(
  ({
    className = '',
    authorName = 'Mainak Chaudhuri',
    githubUsername = 'MainakVerse',
    repoUrl = 'mausumnet',
  }: FooterProps) => {
    const currentYear = new Date().getFullYear();
    const githubProfileUrl = `https://github.com/${githubUsername}`;
    const githubRepoUrl = `${githubProfileUrl}/${repoUrl}`;

    return (
      <footer
        className={`w-full bg-background border-t border-border/40 mt-auto ${className}`}
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span>Made with</span>
              <span
                className="text-red-500 inline-flex items-center"
                role="img"
                aria-label="love"
              >
                <span className="animate-pulse">💙</span>
              </span>
              <span>by</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={githubProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
                    aria-label={`Visit ${authorName}'s GitHub profile`}
                  >
                    {authorName}
                  </a>
                </TooltipTrigger>
                <TooltipContent>Visit GitHub Profile</TooltipContent>
              </Tooltip>
              <span className="mx-1">©</span>
              <span>{currentYear}</span>
            </span>

            
          </div>
        </div>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';

export default Footer;
