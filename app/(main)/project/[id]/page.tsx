'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProjectHero } from '@/components/ProjectDetail/ProjectHero';
import { RequirementsSection } from '@/components/ProjectDetail/RequirementsSection';
import { TechStackSection } from '@/components/ProjectDetail/TechStackSection';
import { ExecutionPlanSection } from '@/components/ProjectDetail/ExecutionPlanSection';
import { RiskSection } from '@/components/ProjectDetail/RiskSection';
import { MetricsSection } from '@/components/ProjectDetail/MetricsSection';
import { ExportModal } from '@/components/ProjectDetail/ExportModal';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { exportProject } from '@/services/exportHandler';
import { buildApiUrl } from '@/lib/api';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const response = await fetch(buildApiUrl(`/api/projects/${projectId}`));

        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }

        const data = await response.json();
        setProject(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center space-y-4">
            <p className="text-lg font-medium text-danger">Error Loading Project</p>
            <p className="text-neutral-600 dark:text-neutral-400">
              {error || 'Project not found'}
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Transform API data to match component expectations
  const requirementsSectionProps = {
    functional: project.requirements?.functional_requirements?.map((text: string, i: number) => ({
      id: `f-${i}`,
      text,
    })) || [],
    nonFunctional: project.requirements?.non_functional_requirements?.map((text: string, i: number) => ({
      id: `nf-${i}`,
      text,
    })) || [],
    assumptions: project.requirements?.assumptions?.map((text: string, i: number) => ({
      id: `a-${i}`,
      text,
    })) || [],
    missing: project.requirements?.missing_information?.map((text: string, i: number) => ({
      id: `m-${i}`,
      text,
    })) || [],
  };

  const techStackProps = {
    recommendations: Object.entries(project.tech_stack || {}).map(([category, data]: any, i) => ({
      id: `tech-${i}`,
      category,
      choice: data?.choice || '',
      reason: data?.reason || '',
      confidence: 4.2,
      icon: '🔧',
    })),
  };

  const executionPlanProps = {
    modules: project.task_plan?.modules?.map((module: any, i: number) => ({
      id: `module-${i}`,
      name: module.module_name,
      estimateDays: module.tasks?.reduce((sum: number, t: any) => sum + (t.estimate_days || 0), 0) || 0,
      tasks: module.tasks?.map((task: any, j: number) => ({
        id: `task-${i}-${j}`,
        name: task.task_name,
        estimateDays: task.estimate_days || 0,
        dependencies: task.depends_on || [],
        progress: 0,
      })) || [],
    })) || [],
  };

  const riskProps = {
    risks: project.risks?.risks?.map((risk: any, i: number) => ({
      id: `risk-${i}`,
      risk: risk.risk,
      severity: risk.severity,
      mitigation: risk.mitigation,
      impact: risk.description || 'Medium impact',
    })) || [],
  };

  const metricsProps = {
    metrics: [
      {
        label: 'Estimated Duration',
        value: project.task_plan?.modules?.reduce((sum: number, m: any) =>
          sum + m.tasks?.reduce((s: number, t: any) => s + (t.estimate_days || 0), 0), 0) || 0,
        unit: 'days',
        color: 'accent' as const,
      },
      {
        label: 'Total Tasks',
        value: project.task_plan?.modules?.reduce((sum: number, m: any) => sum + (m.tasks?.length || 0), 0) || 0,
        color: 'info' as const,
      },
      {
        label: 'Risk Count',
        value: project.risks?.risks?.length || 0,
        color: 'warning' as const,
      },
      {
        label: 'Tech Stack Items',
        value: Object.keys(project.tech_stack || {}).length,
        color: 'success' as const,
      },
    ],
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link href="/projects" className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors mb-6">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Projects</span>
      </Link>

      {/* Hero Section */}
      <ProjectHero
        title={project.title || 'Project Analysis'}
        id={project.id}
        status={project.status || 'completed'}
        createdAt={project.created_at}
        onRegenerateClick={() => setShowRegenerateModal(true)}
        onExportClick={() => setShowExportModal(true)}
        onShareClick={() => {
          // TODO: Implement share functionality
          const projectUrl = `${window.location.origin}/project/${project.id}`;
          navigator.clipboard.writeText(projectUrl).then(() => {
            alert('Project link copied to clipboard!');
          });
        }}
      />

      {/* Metrics */}
      <MetricsSection {...metricsProps} />

      {/* Requirements Analysis */}
      <RequirementsSection {...requirementsSectionProps} />

      {/* Tech Stack */}
      <TechStackSection {...techStackProps} />

      {/* Execution Plan */}
      <ExecutionPlanSection {...executionPlanProps} />

      {/* Risk Analysis */}
      <RiskSection {...riskProps} />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        projectTitle={project.title || 'Project Analysis'}
        onExport={async (format, options) => {
          try {
            const exportData = {
              title: project.title || 'Project Analysis',
              id: project.id,
              status: project.status || 'completed',
              createdAt: project.created_at,
              requirements: options.includeRequirements ? {
                functional: project.requirements?.functional_requirements || [],
                nonFunctional: project.requirements?.non_functional_requirements || [],
                assumptions: project.requirements?.assumptions || [],
                missing: project.requirements?.missing_information || [],
              } : undefined,
              techStack: options.includeTechStack ? Object.entries(project.tech_stack || {}).map(([category, data]: any) => ({
                category,
                choice: data?.choice || '',
                reason: data?.reason || '',
                confidence: 4.2,
              })) : undefined,
              risks: options.includeRisks ? (project.risks?.risks || []) : undefined,
              metrics: options.includeMetrics ? [
                {
                  label: 'Total Tasks',
                  value: project.task_plan?.modules?.reduce((sum: number, m: any) => sum + (m.tasks?.length || 0), 0) || 0,
                },
              ] : undefined,
              notes: options.includeNotes ? 'Project notes and analysis details' : undefined,
            };

            await exportProject(exportData, format, options);
          } catch (err: any) {
            throw new Error(err.message || 'Failed to export project');
          }
        }}
      />

      {/* Regenerate Modal */}
      <Modal
        isOpen={showRegenerateModal}
        onClose={() => setShowRegenerateModal(false)}
        title="Regenerate Analysis"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowRegenerateModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRegenerateModal(false)}>
              Regenerate
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            Choose the quality level for re-analysis:
          </p>

          <div className="space-y-2">
            {['Quick (2-3 min)', 'Balanced (5-7 min)', 'Complete (10-15 min)'].map((option) => (
              <label key={option} className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800">
                <input type="radio" name="quality" className="accent-accent" defaultChecked={option === 'Balanced (5-7 min)'} />
                <span className="font-medium text-neutral-900 dark:text-neutral-50">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </main>
  );
}
