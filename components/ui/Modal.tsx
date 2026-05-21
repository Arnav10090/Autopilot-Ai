'use client';

import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the modal
  const getFocusableElements = () => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
  };

  // Handle tab key and focus trapping
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (e.shiftKey) {
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Handle Escape key
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      // Add aria-hidden to main content
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('aria-hidden', 'true');
      }

      // Focus first focusable element in modal
      setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 0);

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    } else {
      document.body.style.overflow = 'unset';

      // Remove aria-hidden from main content
      const main = document.querySelector('main');
      if (main) {
        main.removeAttribute('aria-hidden');
      }

      // Restore focus to the previously focused element
      if (previousActiveElement.current && previousActiveElement.current.focus) {
        setTimeout(() => {
          previousActiveElement.current?.focus();
        }, 0);
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
        role="button"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative w-[90%] overflow-hidden rounded-2xl bg-surface shadow-2xl animate-fade-in sm:w-full ${sizeClasses[size]} max-h-[calc(100dvh-2rem)] dark:bg-surface-dark`}
      >
        {/* Header */}
        {(title || closeButton) && (
          <div className="flex items-center justify-between border-b border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
            {title && <h2 id="modal-title" className="font-display text-base font-700 text-neutral-900 sm:text-lg dark:text-neutral-50">{title}</h2>}
            {!title && <div />}
            {closeButton && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="min-h-[44px] min-w-[44px] rounded-lg p-1 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent dark:hover:bg-neutral-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto p-4 sm:p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-neutral-200 p-4 sm:p-6 dark:border-neutral-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
