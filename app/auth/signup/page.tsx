'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/global/ThemeToggle';
import { TermsContent } from '@/components/legal/TermsContent';
import { PrivacyContent } from '@/components/legal/PrivacyContent';
import { buildApiUrl } from '@/lib/api';

function getPasswordStrength(password: string) {
  if (!password) return { strength: 0, label: 'No password', color: 'bg-neutral-300' };
  if (password.length < 6) return { strength: 1, label: 'Very weak', color: 'bg-danger' };
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { strength: 2, label: 'Weak', color: 'bg-warning' };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) return { strength: 3, label: 'Good', color: 'bg-accent-2' };
  return { strength: 4, label: 'Strong', color: 'bg-success' };
}

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('You must agree to the terms');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(buildApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dob: formData.dob,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Store user session (auto-login)
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home on success
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-neutral-900 dark:bg-gradient-to-br dark:from-accent dark:to-accent-2 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-display font-bold text-lg">AP</span>
          </div>
        </div>

        <Card>
          <CardHeader title="Create Account" subtitle="Join AutoPilot AI to get started" />

          <CardBody className="space-y-5">
            {error && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg">
                <p className="text-sm text-danger font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              <Input
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                {/* Password strength meter */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                      <Badge variant="info" size="sm">
                        {passwordStrength.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Use uppercase, lowercase, numbers and symbols for a stronger password
                    </p>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formData.confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
                required
                disabled={isLoading}
              />

              {/* Terms checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-2 border-neutral-300 dark:border-neutral-600 accent-accent cursor-pointer"
                />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  I agree to the{' '}
                  <button type="button" onClick={() => setShowTerms(true)} className="text-accent hover:text-accent-2 font-medium hover:underline">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" onClick={() => setShowPrivacy(true)} className="text-accent hover:text-accent-2 font-medium hover:underline">
                    Privacy Policy
                  </button>
                </span>
              </label>

              <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface dark:bg-surface-dark text-neutral-600 dark:text-neutral-400">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social sign-up */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                disabled={isLoading}
                onClick={() => {
                  window.location.href = buildApiUrl('/api/auth/google');
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                disabled={isLoading}
                onClick={() => {
                  window.location.href = buildApiUrl('/api/auth/github');
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </CardBody>

          <CardFooter divider={false}>
            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-accent hover:text-accent-2 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>


      {/* Terms Modal */}
      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
        size="lg"
        closeButton={false}
        closeOnOverlayClick={false}
      >
        <div className="max-h-[60vh] overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <TermsContent />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowTerms(false)}>Close</Button>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy Policy"
        size="lg"
        closeButton={false}
        closeOnOverlayClick={false}
      >
        <div className="max-h-[60vh] overflow-y-auto p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <PrivacyContent />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowPrivacy(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
