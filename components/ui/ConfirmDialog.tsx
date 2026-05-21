'use client';

import { ReactNode } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 animate-fade-in sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-[90%] max-w-lg animate-scale-in rounded-2xl border border-neutral-200 bg-surface shadow-2xl dark:border-neutral-800 dark:bg-surface-dark">
        {/* Header */}
        <div className="px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              variant === 'danger' 
                ? 'bg-danger/10 text-danger' 
                : 'bg-accent/10 text-accent'
            }`}>
              {variant === 'danger' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {/* Title */}
            <div className="flex-1">
              <h3 className="text-xl font-display font-700 text-neutral-900 dark:text-neutral-50">
                {title}
              </h3>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Message */}
        <div className="px-4 pb-5 sm:px-6 sm:pb-6">
          <div className="text-neutral-600 dark:text-neutral-400">
            {message}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 px-4 pb-5 sm:flex-row sm:justify-end sm:px-6 sm:pb-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-h-[44px] w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="min-h-[44px] w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
