'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  isDataReady?: boolean;
  onAnimationComplete?: () => void;
}

const agents = [
  {
    name: "Requirements Analyst",
    task: "Analyzing requirements",
    emoji: "🔍",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Tech Architect", 
    task: "Selecting tech stack",
    emoji: "🏗️",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Project Planner",
    task: "Planning tasks",
    emoji: "📋",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Risk Assessor",
    task: "Assessing risks",
    emoji: "⚠️",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "Final Output",
    task: "Generating final output",
    emoji: "✨",
    color: "from-indigo-500 to-purple-500",
    isFinalStep: true,
  },
];

export default function AgentProgress({ isDataReady = false, onAnimationComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const completedRef = useRef(false);

  // Time per step for first 4 agents (2 seconds each)
  const timePerStep = 2000;
  // Total 4 agents take 8 seconds, then wait for API on step 5

  useEffect(() => {
    if (completedRef.current) return;

    // For the first 4 agents, auto-progress
    if (currentStep < agents.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, timePerStep);

      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // When data is ready and we're on the final step, complete the animation
  useEffect(() => {
    if (isDataReady && currentStep === agents.length - 1 && !completedRef.current) {
      completedRef.current = true;
      setIsComplete(true);
      // Short delay for visual feedback before redirect
      setTimeout(() => {
        onAnimationComplete?.();
      }, 800);
    }
  }, [isDataReady, currentStep, onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/95 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-2 text-2xl font-display font-700 text-white sm:text-3xl">
            AI Agents at Work
          </h2>
          <p className="text-sm text-neutral-400 sm:text-base">
            {isComplete ? "Analysis complete! Redirecting..." : "Our AI team is analyzing your project..."}
          </p>
        </div>

        {/* Agent Cards */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {agents.map((agent, index) => {
            const isFinalStep = 'isFinalStep' in agent && agent.isFinalStep;
            const isCompleted = isFinalStep 
              ? (isDataReady && isComplete) 
              : (index < currentStep || isComplete);
            const isActive = index === currentStep && !isComplete;
            const isWaitingForData = isFinalStep && index === currentStep && !isDataReady;

            return (
              <div
                key={agent.name}
                className={`relative rounded-2xl border-2 p-4 transition-all duration-500 ${
                  isActive
                    ? 'border-white bg-white/10 scale-105 shadow-2xl shadow-white/10'
                    : isCompleted
                    ? 'border-green-500/50 bg-green-500/10'
                    : 'border-neutral-700 bg-neutral-800/50 opacity-50'
                }`}
              >
                {/* Agent Avatar */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${
                      isActive
                        ? `bg-gradient-to-br ${agent.color}`
                        : isCompleted
                        ? 'bg-green-500'
                        : 'bg-neutral-700'
                    }`}
                  >
                    {/* Rotating ring for active agent */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin-slow" />
                    )}
                    
                    {/* Inner circle for emoji */}
                    <div className={`absolute inset-1.5 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-neutral-900' : isCompleted ? 'bg-green-500' : 'bg-neutral-700'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={isActive ? 'animate-pulse' : ''}>{agent.emoji}</span>
                      )}
                    </div>
                  </div>

                  {/* Agent Name */}
                  <h3 className={`font-medium text-xs mb-0.5 ${
                    isActive ? 'text-white' : isCompleted ? 'text-green-400' : 'text-neutral-500'
                  }`}>
                    {agent.name}
                  </h3>

                  {/* Status */}
                  <p className={`text-xs ${
                    isActive ? 'text-neutral-300' : isCompleted ? 'text-green-500/70' : 'text-neutral-600'
                  }`}>
                    {isCompleted ? 'Complete' : isWaitingForData ? 'Waiting for AI...' : isActive ? 'Working...' : 'Waiting'}
                  </p>

                  {/* Active indicator animation */}
                  {isActive && (
                    <div className="mt-1.5 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-2 transition-all duration-500 ease-out"
            style={{ width: `${isComplete ? 100 : ((currentStep + (isDataReady ? 1 : 0.5)) / agents.length) * 100}%` }}
          />
        </div>

        {/* Current Task Label */}
        <div className="text-center mt-4">
          <p className="text-neutral-400 text-sm">
            {isComplete ? (
              <span className="text-green-400">✓ All agents have completed their work</span>
            ) : (
              <>
                Step {currentStep + 1} of {agents.length}:{' '}
                <span className="text-white font-medium">{agents[currentStep]?.task}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
