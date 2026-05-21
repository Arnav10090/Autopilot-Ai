"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Pill } from '@/components/ui/Pill';
import { Select } from '@/components/ui/Select';
import { buildApiUrl } from '@/lib/api';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  date: string;
  owner: string;
  tags: string[];
  skill_level: string;
  team_size: number;
}

const DEFAULT_PROJECTS: Project[] = [];

type ViewMode = 'grid' | 'list';
type SortField = 'date' | 'title' | 'status';

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [cardsPerPage, setCardsPerPage] = useState(12);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Get user_id from localStorage session
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        
        const url = userId
          ? buildApiUrl(`/api/projects?user_id=${userId}`)
          : buildApiUrl('/api/projects');
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (mounted && data.projects) setProjects(data.projects);
      } catch (e) {
        console.warn('Failed to load projects:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let result = projects;

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus) {
      if (selectedStatus === 'Completed') {
        result = result.filter((p) => p.status.toLowerCase() === 'completed');
      } else if (selectedStatus === 'Incomplete') {
        result = result.filter((p) => p.status.toLowerCase() !== 'completed');
      } else {
        result = result.filter((p) => p.status === selectedStatus);
      }
    }

    // Sort
    result.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [projects, searchQuery, selectedStatus, sortField, sortOrder]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, sortField, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProjects, currentPage, itemsPerPage]);

  const statuses = ['All', 'Completed', 'Incomplete'];
  const statusColors: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
    'completed': 'success',
    'Completed': 'success',
    'incomplete': 'warning',
    'Incomplete': 'warning',
    'Planning': 'warning',
    'In Progress': 'info',
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
              <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Manage and track all your AI-analyzed projects
            </p>
          </div>
          <Link href="/create">
            <Button size="lg">Create Project</Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />

          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status === 'All' ? null : (selectedStatus === status ? null : status))}
                className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                  (status === 'All' && selectedStatus === null) || selectedStatus === status
                    ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* View controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {filteredAndSortedProjects.length} project{filteredAndSortedProjects.length !== 1 ? 's' : ''}
            </div>
            {/* Cards per page - Grid View */}
            {viewMode === 'grid' && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>Show</span>
                <Select
                  value={cardsPerPage}
                  onChange={(val) => setCardsPerPage(Number(val))}
                  containerClassName="w-24"
                  className="py-1.5"
                  options={[
                    { value: 6, label: '6' },
                    { value: 12, label: '12' },
                    { value: 24, label: '24' },
                    { value: 48, label: '48' },
                  ]}
                />
                <span>cards</span>
              </div>
            )}
            
            {/* Rows per page - List View */}
            {viewMode === 'list' && (
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span>Show</span>
                <Select
                  value={itemsPerPage}
                  onChange={(val) => setItemsPerPage(Number(val))}
                  containerClassName="w-24"
                  className="py-1.5"
                  options={[
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                    { value: 20, label: '20' },
                    { value: 50, label: '50' },
                  ]}
                />
                <span>rows</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex border border-neutral-200 dark:border-neutral-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-accent text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                aria-label="Grid view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-accent text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                aria-label="List view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects grid/list */}
      {filteredAndSortedProjects.length > 0 ? (
        viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProjects.slice(0, cardsPerPage).map((project, index) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <Card
                  isHoverable
                  className="h-full animate-slide-up group relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Gradient accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <CardBody className="space-y-4 p-5">
                    {/* Header with status */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-700 text-lg text-neutral-900 dark:text-neutral-50 line-clamp-2 group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <Badge variant={statusColors[project.status]} className="shrink-0">
                        {project.status}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>{project.team_size} member{project.team_size !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span>{project.skill_level}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.tags.slice(0, 3).map((tag: string) => (
                            <Pill key={tag} variant="accent" className="text-xs">
                              {tag}
                            </Pill>
                          ))}
                          {project.tags.length > 3 && (
                            <Pill variant="default" className="text-xs">
                              +{project.tags.length - 3}
                            </Pill>
                          )}
                        </div>
                      )}
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>{new Date(project.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 text-accent group-hover:translate-x-1 transition-transform">
                          View details
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-[48rem] w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-center p-4">
                    <button
                      onClick={() => handleSort('title')}
                      className="font-display font-700 text-neutral-900 dark:text-neutral-50 hover:text-accent transition-colors flex items-center justify-center gap-2 w-full"
                    >
                      Project
                      {sortField === 'title' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={sortOrder === 'asc' ? 'M7 14l5-5 5 5z' : 'M7 10l5 5 5-5z'} />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="text-center p-4">
                    <button
                      onClick={() => handleSort('status')}
                      className="font-display font-700 text-neutral-900 dark:text-neutral-50 hover:text-accent transition-colors flex items-center justify-center gap-2 w-full"
                    >
                      Status
                      {sortField === 'status' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={sortOrder === 'asc' ? 'M7 14l5-5 5 5z' : 'M7 10l5 5 5-5z'} />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="text-center p-4">Owner</th>
                  <th className="text-center p-4">
                    <button
                      onClick={() => handleSort('date')}
                      className="font-display font-700 text-neutral-900 dark:text-neutral-50 hover:text-accent transition-colors flex items-center justify-center gap-2 w-full"
                    >
                      Created
                      {sortField === 'date' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={sortOrder === 'asc' ? 'M7 14l5-5 5 5z' : 'M7 10l5 5 5-5z'} />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="text-center p-4 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="p-4 text-center">
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">
                        {project.title}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant={statusColors[project.status]}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
                      {project.owner}
                    </td>
                    <td className="p-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(project.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center w-40">
                      <Link href={`/project/${project.id}`}>
                        <Button size="sm" variant="outline">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
                {/* Items per page */}
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <span>Show</span>
                  <Select
                    value={itemsPerPage}
                    onChange={(val) => setItemsPerPage(Number(val))}
                    containerClassName="w-24"
                    className="py-1.5"
                    options={[
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 20, label: '20' },
                      { value: 50, label: '50' },
                    ]}
                  />
                  <span>per page</span>
                </div>

                {/* Page info */}
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedProjects.length)} of {filteredAndSortedProjects.length} results
                </div>

                {/* Page navigation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="First page"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-accent text-white'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Last page"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </Card>
        )
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2m4-4l2 2m-2-2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
            No projects found
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Create your first project to get started'}
          </p>
          {!searchQuery && !selectedStatus && (
            <Link href="/create">
              <Button>Create Project</Button>
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
