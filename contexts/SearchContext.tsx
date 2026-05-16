'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { buildApiUrl } from '@/lib/api';

export interface SearchableItem {
  id: string;
  type: 'project' | 'template' | 'faq' | 'page' | 'setting';
  title: string;
  description: string;
  href: string;
  icon?: string;
  keywords?: string[];
}

interface SearchContextType {
  items: SearchableItem[];
  search: (query: string) => SearchableItem[];
  isLoading: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Static items that are always searchable
const STATIC_ITEMS: SearchableItem[] = [
  // Pages
  { id: 'page-projects', type: 'page', title: 'Projects', description: 'View all your projects', href: '/projects', icon: '📁' },
  { id: 'page-create', type: 'page', title: 'Create Project', description: 'Start a new project', href: '/create', icon: '✨' },
  { id: 'page-analytics', type: 'page', title: 'Analytics', description: 'View performance metrics', href: '/analytics', icon: '📊' },
  { id: 'page-templates', type: 'page', title: 'Templates', description: 'Browse project templates', href: '/templates', icon: '📋' },
  { id: 'page-settings', type: 'page', title: 'Settings', description: 'Account and preferences', href: '/settings', icon: '⚙️' },
  { id: 'page-help', type: 'page', title: 'Help & Support', description: 'Get help and FAQs', href: '/help', icon: '❓' },
  
  // Settings sections
  { id: 'setting-theme', type: 'setting', title: 'Theme Settings', description: 'Light/Dark mode', href: '/settings', icon: '🎨', keywords: ['dark', 'light', 'mode', 'appearance'] },
  { id: 'setting-language', type: 'setting', title: 'Language Settings', description: 'Change language', href: '/settings', icon: '🌍', keywords: ['language', 'locale', 'translation'] },
  { id: 'setting-notifications', type: 'setting', title: 'Notifications', description: 'Notification preferences', href: '/settings', icon: '🔔', keywords: ['alerts', 'email'] },
  
  // FAQ items
  { id: 'faq-getting-started', type: 'faq', title: 'Getting Started', description: 'How to get started with AutoPilot AI', href: '/help#faq', icon: '🚀', keywords: ['begin', 'how to', 'start', 'tutorial'] },
  { id: 'faq-features', type: 'faq', title: 'Features', description: 'Learn about all features', href: '/help#faq', icon: '✨', keywords: ['capabilities', 'what can'] },
  { id: 'faq-billing', type: 'faq', title: 'Billing & Pricing', description: 'Payment and subscription info', href: '/help#faq', icon: '💳', keywords: ['payment', 'subscription', 'cost', 'price'] },
  { id: 'faq-account', type: 'faq', title: 'Account Help', description: 'Account management and login', href: '/help#faq', icon: '👤', keywords: ['login', 'password', 'email', 'profile'] },
  
  // Templates (static templates from the templates page)
  { id: 'template-saas', type: 'template', title: 'SaaS Dashboard', description: 'Modern admin panel with analytics', href: '/templates', icon: '📊', keywords: ['saas', 'dashboard', 'admin', 'analytics'] },
  { id: 'template-ecommerce', type: 'template', title: 'E-commerce Platform', description: 'Full-stack online store', href: '/templates', icon: '🛒', keywords: ['shop', 'store', 'ecommerce', 'products'] },
  { id: 'template-social', type: 'template', title: 'Social Network', description: 'Community platform with feeds', href: '/templates', icon: '👥', keywords: ['social', 'community', 'network', 'feed'] },
  { id: 'template-mobile', type: 'template', title: 'Mobile App', description: 'Cross-platform mobile application', href: '/templates', icon: '📱', keywords: ['mobile', 'ios', 'android', 'app'] },
  { id: 'template-ai', type: 'template', title: 'AI/ML Project', description: 'Machine learning pipeline', href: '/templates', icon: '🤖', keywords: ['ai', 'ml', 'machine learning', 'artificial intelligence'] },
  { id: 'template-api', type: 'template', title: 'REST API', description: 'Backend API service', href: '/templates', icon: '⚙️', keywords: ['api', 'backend', 'server', 'rest'] },
];

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [dynamicItems, setDynamicItems] = useState<SearchableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-fetch all dynamic content on mount
  useEffect(() => {
    async function loadAllContent() {
      setIsLoading(true);
      try {
        // Fetch projects
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        const projectsUrl = userId
          ? buildApiUrl(`/api/projects?user_id=${userId}`)
          : buildApiUrl('/api/projects');
        
        const projectsRes = await fetch(projectsUrl);
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (projectsData.projects) {
            const projectItems: SearchableItem[] = projectsData.projects.map((p: { id: string; title: string; description: string; owner?: string; skill_level?: string; tags?: string[] }) => ({
              id: `project-${p.id}`,
              type: 'project' as const,
              title: p.title,
              description: p.description,
              href: '/projects',  // Link to projects page (no individual project pages)
              icon: '📁',
              keywords: [p.owner || '', p.skill_level || '', ...(p.tags || [])].filter(Boolean),
            }));
            setDynamicItems(projectItems);
          }
        }
      } catch (e) {
        console.warn('Failed to pre-load search content:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadAllContent();
  }, []);

  const search = useCallback((query: string): SearchableItem[] => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    const allItems = [...STATIC_ITEMS, ...dynamicItems];
    
    return allItems.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.keywords && item.keywords.some(k => k.toLowerCase().includes(q)))
    );
  }, [dynamicItems]);

  const items = [...STATIC_ITEMS, ...dynamicItems];

  return (
    <SearchContext.Provider value={{ items, search, isLoading }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
