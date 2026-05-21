'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { Logo } from './Logo';
import { useSidebar } from '@/contexts/SidebarContext';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileOpen, toggleMobileSidebar, closeMobileSidebar } = useSidebar();

  // Detect scroll to apply blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMobileSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMobileSidebar]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-transparent transition-all duration-200 ${scrolled
        ? 'bg-surface/80 backdrop-blur-md dark:bg-surface-dark/80'
        : 'bg-surface dark:bg-surface-dark'
        }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleMobileSidebar}
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-controls="main-nav"
              aria-expanded={isMobileOpen}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-neutral-200 bg-surface text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-neutral-800 dark:bg-surface-dark dark:text-neutral-50 dark:hover:bg-neutral-800 lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:outline-offset-2"
              aria-label="AutoPilot AI Home"
            >
              <Logo className="h-8 w-8 text-neutral-900 dark:text-neutral-50" />
              <span className="hidden font-display text-base font-700 text-neutral-900 dark:text-neutral-50 sm:inline lg:text-lg">
                AutoPilot
              </span>
            </Link>
          </div>

          <div className="hidden flex-1 px-2 md:block lg:px-6">
            <SearchBar />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
