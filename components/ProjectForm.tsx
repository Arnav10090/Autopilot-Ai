'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { analyzeProject } from '@/services/api';
import { CreateProjectPayload } from '@/types/project';
import AgentProgress from '@/components/AgentProgress';

type Step = 'info' | 'team' | 'constraints' | 'quality' | 'review';

const STEPS: { id: Step; label: string; icon: string }[] = [
  { id: 'info', label: 'Project Info', icon: '📋' },
  { id: 'team', label: 'Team & Timeline', icon: '👥' },
  { id: 'constraints', label: 'Constraints', icon: '🔒' },
  { id: 'quality', label: 'Quality & Scope', icon: '⭐' },
  { id: 'review', label: 'Review', icon: '✓' },
];

const TEMPLATE_PRESETS: Record<string, Partial<CreateProjectPayload>> = {
  // Web Category
  '1': {
    project_description: 'Build a full-stack web application with a responsive dashboard, user authentication, and database integration.',
    team_size: 4,
    deadline: '3 months',
    skill_level: 'Intermediate',
    constraints: 'Must be SEO friendly and performance optimized.',
  },
  '101': {
    project_description: 'Develop a full-featured online store with shopping cart, checkout process, and inventory management system.',
    team_size: 4,
    deadline: '4 months',
    skill_level: 'Intermediate',
    constraints: 'Secure payment processing and PCI compliance required.',
  },
  '102': {
    project_description: 'Create an admin dashboard with analytics charts, user management, and subscription billing integration.',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Intermediate',
    constraints: 'Must use modern charting libraries and responsive design.',
  },
  '103': {
    project_description: 'Build a personal portfolio website with blog functionality and a project showcase gallery.',
    team_size: 1,
    deadline: '2 weeks',
    skill_level: 'Beginner',
    constraints: 'Mobile responsive design and fast loading speeds.',
  },
  '104': {
    project_description: 'Develop a community platform with user profiles, activity feeds, and real-time messaging.',
    team_size: 5,
    deadline: '6 months',
    skill_level: 'Advanced',
    constraints: 'Scalable database architecture for high concurrency.',
  },
  '105': {
    project_description: 'Design a high-conversion landing page optimized for marketing campaigns with A/B testing support.',
    team_size: 2,
    deadline: '1 month',
    skill_level: 'Beginner',
    constraints: 'Integration with marketing tools and analytics.',
  },

  // Mobile Category
  '2': {
    project_description: 'Develop a cross-platform mobile application for iOS and Android using React Native.',
    team_size: 3,
    deadline: '4 months',
    skill_level: 'Advanced',
    constraints: 'Offline first architecture required.',
  },
  '201': {
    project_description: 'Build a fitness tracking application with GPS integration, health metrics, and progress charts.',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Intermediate',
    constraints: 'Battery efficient GPS usage and background sync.',
  },
  '202': {
    project_description: 'Create an on-demand food delivery app with real-time driver tracking and in-app payments.',
    team_size: 4,
    deadline: '4 months',
    skill_level: 'Advanced',
    constraints: 'Real-time location updates and push notifications.',
  },
  '203': {
    project_description: 'Develop a real-time messaging app supporting text, voice, and video calls with end-to-end encryption.',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Advanced',
    constraints: 'Low latency messaging and secure media handling.',
  },
  '204': {
    project_description: 'Build a travel companion app with interactive maps, itinerary planning, and local guide recommendations.',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Intermediate',
    constraints: 'Offline map access and location services.',
  },
  '205': {
    project_description: 'Create an education platform mobile app with course content, quizzes, and progress tracking.',
    team_size: 3,
    deadline: '4 months',
    skill_level: 'Intermediate',
    constraints: 'Video streaming optimization and offline content support.',
  },

  // Backend Category
  '3': {
    project_description: 'Design and implement a scalable RESTful API service with microservices architecture.',
    team_size: 2,
    deadline: '2 months',
    skill_level: 'Advanced',
    constraints: 'High availability and rate limiting required.',
  },
  '301': {
    project_description: 'Implement a secure authentication service with OAuth provider support, JWT, and role-based access control.',
    team_size: 2,
    deadline: '2 months',
    skill_level: 'Advanced',
    constraints: 'Strict security standards and token management.',
  },
  '302': {
    project_description: 'Develop a payment gateway integration service tackling subscription management and recurring billing.',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Expert',
    constraints: 'PCI DSS compliance and robust error handling.',
  },
  '303': {
    project_description: 'Build a headless CMS to manage and deliver structured content via API to multiple platforms.',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Intermediate',
    constraints: 'Flexible schema definition and GraphQL API.',
  },
  '304': {
    project_description: 'Create a dedicated WebSocket server for handling real-time updates and instant notifications.',
    team_size: 2,
    deadline: '2 months',
    skill_level: 'Advanced',
    constraints: 'Scalable for high concurrent connections.',
  },
  '305': {
    project_description: 'Implement a dedicated search engine service with indexing, relevance ranking, and fuzzy search capabilities.',
    team_size: 3,
    deadline: '4 months',
    skill_level: 'Expert',
    constraints: 'Fast response times and efficient indexing.',
  },

  // Data Category
  '4': {
    project_description: 'Construct a data pipeline for ETL processing and real-time analytics.',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Expert',
    constraints: 'Must handle high throughput data ingestion.',
  },
  '401': {
    project_description: 'Setup a data warehouse solution with automated data extraction and generation of reporting dashboards.',
    team_size: 3,
    deadline: '4 months',
    skill_level: 'Advanced',
    constraints: 'Data integrity checks and scheduled reporting.',
  },
  '402': {
    project_description: 'Build a centralized log aggregation system to collect, store, and analyze application logs.',
    team_size: 2,
    deadline: '2 months',
    skill_level: 'Intermediate',
    constraints: 'Efficient storage and searchable logs.',
  },
  '403': {
    project_description: 'Develop a recommendation engine using collaborative filtering to provide personalized suggestions.',
    team_size: 4,
    deadline: '5 months',
    skill_level: 'Expert',
    constraints: 'Scalable algorithms and A/B testing support.',
  },
  '404': {
    project_description: 'Create an ingestion system for high-frequency IoT sensor data streams.',
    team_size: 3,
    deadline: '4 months',
    skill_level: 'Advanced',
    constraints: 'Time-series database and real-time processing.',
  },
  '405': {
    project_description: 'Build an automated web scraping tool for data extraction and monitoring.',
    team_size: 2,
    deadline: '2 months',
    skill_level: 'Intermediate',
    constraints: 'Proxy management and anti-bot handling.',
  },

  // AI Category
  '5': {
    project_description: 'Develop and deploy a machine learning model for predictive analysis.',
    team_size: 4,
    deadline: '5 months',
    skill_level: 'Expert',
    constraints: 'Requires GPU acceleration for training.',
  },
  '501': {
    project_description: 'Create a conversational AI chatbot assistant powered by LLMs for customer support.',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Advanced',
    constraints: 'Natural language understanding and context awareness.',
  },
  '502': {
    project_description: 'Develop a computer vision system for object detection and image classification tasks.',
    team_size: 4,
    deadline: '5 months',
    skill_level: 'Expert',
    constraints: 'High accuracy models and real-time inference.',
  },
  '503': {
    project_description: 'Build an NLP processing pipeline for sentiment analysis and text summarization.',
    team_size: 3,
    deadline: '4 months',
    skill_level: 'Expert',
    constraints: 'Support for multiple languages and large text corpora.',
  },
  '504': {
    project_description: 'Implement a predictive modeling engine for sales forecasting and trend analysis.',
    team_size: 4,
    deadline: '5 months',
    skill_level: 'Expert',
    constraints: 'Statistical accuracy and data visualization.',
  },
  '505': {
    project_description: 'Integrate voice technologies to create a voice assistant with speech-to-text and text-to-speech.',
    team_size: 3,
    deadline: '4 months',
    skill_level: 'Advanced',
    constraints: 'Low latency voice processing.',
  },
};

export default function ProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateProjectPayload>({
    project_description: '',
    team_size: 3,
    deadline: '3 months',
    skill_level: 'Intermediate',
    constraints: '',
  });

  const [selectedQuality, setSelectedQuality] = useState('quick');

  // Load template if present
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && TEMPLATE_PRESETS[templateId]) {
      setForm(prev => ({
        ...prev,
        ...TEMPLATE_PRESETS[templateId]
      }));
    } else {
      // Auto-save/load logic only if no template
      const saved = localStorage.getItem('project_draft');
      if (saved) {
        try {
          setForm(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [searchParams]);

  // Auto-save to localStorage (only if changed by user)
  useEffect(() => {
    if (form.project_description) {
      localStorage.setItem('project_draft', JSON.stringify(form));
    }
  }, [form]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[stepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1].id);
    }
  };

  const [apiResult, setApiResult] = useState<{ project_id: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setApiResult(null);

    if (!form.project_description.trim()) {
      setError('Project description is required');
      return;
    }

    try {
      setIsAnalyzing(true);

      // Get user_id from localStorage session
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : undefined;

      const result = await analyzeProject({
        ...form,
        quality: selectedQuality as 'quick' | 'balanced' | 'complete'
      }, userId);

      if (result && result.project_id) {
        localStorage.removeItem('project_draft');
        setApiResult(result);
        // Don't redirect here - let the animation complete first
      } else {
        setError('Failed to create project. No project ID returned.');
        setIsAnalyzing(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Something went wrong. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const handleAnimationComplete = () => {
    if (apiResult?.project_id) {
      router.push(`/project/${apiResult.project_id}`);
    }
    setIsAnalyzing(false);
  };

  const isStepValid = (step: Step) => {
    switch (step) {
      case 'info':
        return form.project_description.trim().length > 0;
      case 'team':
        return form.team_size > 0 && form.deadline.trim().length > 0;
      case 'constraints':
        return true; // Optional
      case 'quality':
        return true; // Optional
      case 'review':
        return true;
      default:
        return true;
    }
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {isAnalyzing && (
        <AgentProgress 
          isDataReady={!!apiResult} 
          onAnimationComplete={handleAnimationComplete} 
        />
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
          <span className="gradient-text">Create Project Plan</span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Let our AI agents analyze your project and create a comprehensive plan
        </p>
      </div>

      {/* Stepper */}
      <Card className="mb-8">
        <CardBody className="space-y-6">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Step {currentStepIndex + 1} of {STEPS.length}
              </span>
              <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => {
                  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
                  if (index <= stepIndex) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`min-h-[88px] rounded-lg p-3 text-center text-sm font-medium transition-all ${
                  step.id === currentStep
                    ? 'bg-neutral-900 dark:bg-accent text-white shadow-md'
                    : isStepValid(step.id)
                    ? 'bg-success/10 text-success dark:bg-success/20 hover:bg-success/20'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
                disabled={index > currentStepIndex}
              >
                <span className="block text-lg mb-1">{step.icon}</span>
                <span className="block">{step.label}</span>
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step: Project Info */}
        {currentStep === 'info' && (
          <Card className="animate-fade-in">
            <CardHeader title="Project Information" subtitle="Tell us about your project" />
            <CardBody className="space-y-4">
              <TextArea
                label="Project Description"
                name="project_description"
                placeholder="Describe your project idea, goals, key features, and any specific requirements..."
                value={form.project_description}
                onChange={handleInputChange}
                required
                disabled={isAnalyzing}
              />
            </CardBody>
          </Card>
        )}

        {/* Step: Team & Timeline */}
        {currentStep === 'team' && (
          <Card className="animate-fade-in overflow-visible relative z-10">
            <CardHeader title="Team & Timeline" subtitle="Define your team size and project deadline" />
            <CardBody className="space-y-4 overflow-visible">
              <Input
                label="Team Size"
                type="number"
                name="team_size"
                min="1"
                max="100"
                value={form.team_size}
                onChange={handleInputChange}
                required
                disabled={isAnalyzing}
              />

              <Input
                label="Deadline"
                type="text"
                name="deadline"
                placeholder="e.g., 3 months, 6 weeks, Q2 2024"
                value={form.deadline}
                onChange={handleInputChange}
                required
                disabled={isAnalyzing}
              />

                <Select
                  label="Team Skill Level"
                  name="skill_level"
                  value={form.skill_level}
                  onChange={handleInputChange}
                  options={[
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                  ]}
                  disabled={isAnalyzing}
                />
            </CardBody>
          </Card>
        )}

        {/* Step: Constraints */}
        {currentStep === 'constraints' && (
          <Card className="animate-fade-in">
            <CardHeader
              title="Constraints & Requirements"
              subtitle="Specify any technical constraints or special requirements"
            />
            <CardBody className="space-y-4">
              <TextArea
                label="Constraints (Optional)"
                name="constraints"
                placeholder="List any budget limitations, technology restrictions, compliance requirements, or other constraints..."
                value={form.constraints}
                onChange={handleInputChange}
                disabled={isAnalyzing}
                helperText="This helps us recommend more suitable solutions for your project"
              />

              {/* Advanced options */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm font-medium text-accent hover:text-accent-2 transition-colors flex items-center gap-2"
                >
                  <span>{showAdvanced ? '▼' : '▶'}</span>
                  Advanced Options
                </button>

                {showAdvanced && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
                    <Input
                      label="Budget (Optional)"
                      type="text"
                      placeholder="e.g., $50,000, €100,000"
                      disabled={isAnalyzing}
                    />
                    <Input
                      label="Industry/Domain (Optional)"
                      type="text"
                      placeholder="e.g., FinTech, Healthcare, E-commerce"
                      disabled={isAnalyzing}
                    />
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Step: Quality & Scope */}
        {currentStep === 'quality' && (
          <Card className="animate-fade-in">
            <CardHeader
              title="Analysis Quality & Scope"
              subtitle="Choose the depth of analysis you'd like"
            />
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${selectedQuality === 'quick' ? 'border-white bg-white/5' : 'border-neutral-700 hover:border-neutral-500'}`} onClick={() => setSelectedQuality('quick')}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="quick"
                      name="quality"
                      value="quick"
                      checked={selectedQuality === 'quick'}
                      onChange={() => setSelectedQuality('quick')}
                      className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                    />
                    <label htmlFor="quick" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">Quick Analysis</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Fast overview with basic recommendations (2-3 minutes)
                      </p>
                    </label>
                  </div>
                </div>

                <div className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${selectedQuality === 'balanced' ? 'border-white bg-white/5' : 'border-neutral-700 hover:border-neutral-500'}`} onClick={() => setSelectedQuality('balanced')}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="balanced"
                      name="quality"
                      value="balanced"
                      checked={selectedQuality === 'balanced'}
                      onChange={() => setSelectedQuality('balanced')}
                      className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                    />
                    <label htmlFor="balanced" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">Balanced</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Comprehensive analysis with detailed recommendations (5-7 minutes)
                      </p>
                    </label>
                  </div>
                </div>

                <div className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${selectedQuality === 'complete' ? 'border-white bg-white/5' : 'border-neutral-700 hover:border-neutral-500'}`} onClick={() => setSelectedQuality('complete')}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="complete"
                      name="quality"
                      value="complete"
                      checked={selectedQuality === 'complete'}
                      onChange={() => setSelectedQuality('complete')}
                      className="mt-1 w-4 h-4 accent-accent cursor-pointer"
                    />
                    <label htmlFor="complete" className="flex-1 cursor-pointer">
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">Complete</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Deep dive analysis with extensive recommendations and risk assessment (10-15 minutes)
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Step: Review */}
        {currentStep === 'review' && (
          <Card className="animate-fade-in">
            <CardHeader title="Review Your Project" subtitle="Check all details before submitting" />
            <CardBody className="space-y-6">
              {error && (
                <div className="p-4 bg-danger/10 border border-danger/30 rounded-lg">
                  <p className="text-sm text-danger font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Project Description</p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-50">
                    {form.project_description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Team Size</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-50">
                      {form.team_size} {form.team_size === 1 ? 'person' : 'people'}
                    </p>
                  </div>
                  <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Deadline</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-50">{form.deadline}</p>
                  </div>
                </div>

                <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Skill Level</p>
                  <Badge variant="info">{form.skill_level}</Badge>
                </div>

                {form.constraints && (
                  <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Constraints</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-50">
                      {form.constraints}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-accent/10 rounded-lg p-4 border border-accent/30">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  ✓ Ready to submit your project for analysis. Our AI agents will create a comprehensive plan.
                </p>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Navigation */}
        <Card>
          <CardFooter divider={false}>
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStepIndex === 0 || isAnalyzing}
              >
                ← Previous
              </Button>

              {currentStep === 'review' ? (
                <Button
                  type="submit"
                  size="lg"
                  isLoading={isAnalyzing}
                  disabled={!isStepValid(currentStep) || isAnalyzing}
                >
                  Generate Plan
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep) || isAnalyzing}
                >
                  {currentStep === 'quality' ? 'Generate Plan' : 'Next →'}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
