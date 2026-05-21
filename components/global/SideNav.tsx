'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';

export function SideNav() {
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const sidenavRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { label: t('projects'), icon: '📁', href: '/projects' },
    { label: t('createProject'), icon: '✨', href: '/create' },
    { label: t('analytics'), icon: '📊', href: '/analytics' },
    { label: t('templates'), icon: '📋', href: '/templates' },
    { label: t('settings'), icon: '⚙️', href: '/settings' },
    { label: t('help'), icon: '❓', href: '/help' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidenavRef.current && !sidenavRef.current.contains(event.target as Node)) {
        closeMobileSidebar();
      }
    }

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileOpen, closeMobileSidebar]);

  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  useEffect(() => {
    if (!isMobileOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isMobileOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-neutral-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      <aside
        ref={sidenavRef}
        className={`fixed inset-y-16 left-0 z-50 flex w-[min(85vw,20rem)] flex-col border-r border-neutral-200 bg-surface shadow-xl transition-transform duration-300 dark:border-neutral-800 dark:bg-surface-dark lg:translate-x-0 lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div className={`hidden border-b border-neutral-200 px-4 py-4 dark:border-neutral-800 lg:flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            {isCollapsed ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

        <nav id="main-nav" className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={`group relative flex min-h-[48px] items-center rounded-xl py-3 text-sm font-600 transition-all sm:text-base ${
                    isCollapsed ? 'justify-center px-2 lg:px-3' : 'gap-3 px-4'
                  } ${
                    isActive(item.href)
                      ? 'bg-accent text-white shadow-md'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <span className="shrink-0 text-xl" aria-hidden="true">{item.icon}</span>
                  <span className={`truncate whitespace-nowrap ${isCollapsed ? 'hidden' : ''}`}>
                    {item.label}
                  </span>

                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-full z-50 ml-4 whitespace-nowrap rounded-lg bg-neutral-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
