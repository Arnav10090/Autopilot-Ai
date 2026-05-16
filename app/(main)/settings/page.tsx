'use client';

import { useState, useEffect, Suspense } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { buildApiUrl } from '@/lib/api';

function SettingsContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<any>({ name: '', email: '', phone: '', dob: '' });
  const [originalUser, setOriginalUser] = useState<any>({ name: '', email: '', phone: '', dob: '' });
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { language, setLanguage, t } = useLanguage();

  // Confirmation dialog states
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get changed fields
  const getChangedFields = () => {
    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    if (user.name !== originalUser.name) {
      changes.push({ field: 'Name', oldValue: originalUser.name, newValue: user.name });
    }
    if (user.email !== originalUser.email) {
      changes.push({ field: 'Email', oldValue: originalUser.email, newValue: user.email });
    }
    if (user.phone !== originalUser.phone) {
      changes.push({ field: 'Phone', oldValue: originalUser.phone || 'Not set', newValue: user.phone });
    }
    if (user.dob !== originalUser.dob) {
      changes.push({ field: 'Date of Birth', oldValue: originalUser.dob || 'Not set', newValue: user.dob });
    }

    return changes;
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(buildApiUrl(`/api/auth/profile/${user.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          dob: user.dob
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      // Update original user to reflect saved state
      setOriginalUser({ ...user });

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user));

      setShowSaveDialog(false);
      setIsSaving(false);

      // Show success message (you could add a toast/notification here)
      alert('Profile updated successfully!');
    } catch (err: any) {
      console.error('Save failed:', err);
      setIsSaving(false);
      alert('Failed to save changes: ' + err.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) return;

    const confirmed = window.confirm('Do you really want to change your password?');
    if (!confirmed) return;

    setPasswordStatus('saving');
    try {
      const res = await fetch(buildApiUrl('/api/auth/password'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, new_password: newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      // Update local state to show new password
      setUser({ ...user, password: newPassword });
      setNewPassword('');
      setPasswordStatus('success');
      setTimeout(() => setPasswordStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Password change failed:', err);
      setPasswordStatus('error');
      setTimeout(() => setPasswordStatus('idle'), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(buildApiUrl(`/api/auth/account/${user.id}`), {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');

      // Clear session and redirect to signin
      localStorage.removeItem('user');
      window.location.href = '/auth/signin';
    } catch (err: any) {
      console.error('Account deletion failed:', err);
      setIsDeleting(false);
      setShowDeleteDialog(false);
      alert('Failed to delete account: ' + err.message);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      if (!parsed.id) {
        console.error("User ID missing in session:", parsed);
        setUser(parsed);
        setOriginalUser(parsed);
        return;
      }

      // Fetch fresh data from API
      fetch(buildApiUrl(`/api/auth/profile/${parsed.id}`))
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error(data.error);
            setUser(parsed);
            setOriginalUser(parsed);
          } else {
            const userData = {
              ...data,
              password: data.password_hash
            };
            setUser(userData);
            setOriginalUser(userData);
          }
        })
        .catch(err => {
          console.error("Failed to load profile", err);
          setUser(parsed);
          setOriginalUser(parsed);
        });
    }
  }, []);

  // Load and apply theme preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;

    if (selectedTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as 'light' | 'dark' | 'system';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-700 text-neutral-900 dark:text-neutral-50">
          <span className="gradient-text">{t('settings')}</span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {t('settingsSubtitle')}
        </p>
      </div>

      <div className="space-y-8">
        {/* Account Settings */}
        <div className="space-y-4">
          <div id="account" className="scroll-mt-24">
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              {t('account')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('accountSubtitle')}
            </p>
          </div>

          <Card className="relative z-40">
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('fullName')} placeholder="John Doe" value={user.name || ''} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                <Input label={t('email')} type="email" placeholder="john@example.com" value={user.email || ''} onChange={(e) => setUser({ ...user, email: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('dateOfBirth')}
                  type="date"
                  value={user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''}
                  onChange={(e) => setUser({ ...user, dob: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={user.phone || ''}
                  onChange={(e) => {
                    // Only allow numbers and limit to 10 digits
                    const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setUser({ ...user, phone: numericValue });
                  }}
                />
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-800 my-4 pt-4">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-4">{t('security')}</h3>

                {user.isOAuthUser ? (
                  // OAuth User - Show provider info
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                          OAuth Authentication
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                          You signed in with {user.oauthProviders?.map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' and ')}. Your password is managed by your OAuth provider.
                        </p>
                        {user.oauthProviders && user.oauthProviders.length > 0 && (
                          <div className="flex gap-2">
                            {user.oauthProviders.map((provider: string) => (
                              <div key={provider} className="px-3 py-1.5 bg-surface dark:bg-surface-dark rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-medium capitalize">
                                {provider}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {t('currentPassword')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={user.password || '********'}
                          readOnly
                          className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-50"
                        />
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {t('changePassword')}
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter new password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePasswordChange}
                          disabled={!newPassword.trim() || passwordStatus === 'saving'}
                        >
                          {passwordStatus === 'saving' ? t('saving') : t('update')}
                        </Button>
                      </div>
                      {passwordStatus === 'success' && (
                        <p className="text-sm text-success">✓ Password updated successfully!</p>
                      )}
                      {passwordStatus === 'error' && (
                        <p className="text-sm text-danger">✗ Failed to update password</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
            <CardFooter>
              <Button
                onClick={() => {
                  const changes = getChangedFields();
                  if (changes.length === 0) {
                    alert('No changes to save');
                    return;
                  }
                  setShowSaveDialog(true);
                }}
              >
                {t('saveChanges')}
              </Button>
            </CardFooter>
          </Card>
        </div>



        {/* Preferences */}
        <div className="space-y-4">
          <div id="preferences" className="scroll-mt-24">
            <h2 className="text-2xl font-display font-700 text-neutral-900 dark:text-neutral-50 mb-2">
              {t('preferences')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('preferencesSubtitle')}
            </p>
          </div>

          <Card className="relative z-20">
            <CardBody className="space-y-4">
              <div>
                <Select
                  label={t('theme')}
                  value={theme}
                  onChange={(val: any) => handleThemeChange({ target: { value: val } } as any)}
                  options={[
                    { value: 'light', label: t('light') },
                    { value: 'dark', label: t('dark') },
                    { value: 'system', label: t('system') }
                  ]}
                />
              </div>

              <div>
                <Select
                  label={t('language')}
                  value={language}
                  onChange={(val: any) => handleLanguageChange({ target: { value: val } } as any)}
                  options={[
                    { value: 'English', label: 'English' },
                    { value: 'Spanish', label: 'Spanish' },
                    { value: 'French', label: 'French' },
                    { value: 'German', label: 'German' }
                  ]}
                />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <div id="danger-zone" className="scroll-mt-24">
            <h2 className="text-2xl font-display font-700 text-danger mb-2">
              {t('dangerZone')}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t('dangerZoneSubtitle')}
            </p>
          </div>

          <Card className="border-danger/30 bg-danger/5 relative z-10">
            <CardBody className="space-y-4">
              <Button
                variant="danger"
                className="w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                {t('deleteAccount')}
              </Button>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {t('deleteAccountWarning')}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Save Changes Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={handleSaveChanges}
        title="Confirm Changes"
        message={
          <div className="space-y-3">
            <p>Do you really want to make changes to the following fields?</p>
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 space-y-2">
              {getChangedFields().map((change, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium text-neutral-900 dark:text-neutral-50">{change.field}:</span>
                  <div className="ml-4 text-neutral-600 dark:text-neutral-400">
                    <span className="line-through">{change.oldValue}</span> → <span className="text-accent font-medium">{change.newValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
        confirmText="Save Changes"
        cancelText="Cancel"
        isLoading={isSaving}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message={
          <div className="space-y-3">
            <p>Are you sure you want to delete your account?</p>
            <div className="bg-danger/10 rounded-lg p-4">
              <p className="text-sm text-danger font-medium">
                ⚠️ This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        }
        confirmText="Delete Account"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
