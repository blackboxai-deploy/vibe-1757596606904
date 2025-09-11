'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface LoginFormProps {
  onToggleMode?: () => void;
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (formError) setFormError(null);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setFormError(message);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'manager' | 'data-entry') => {
    const demoCredentials = {
      admin: { email: 'admin@company.com', password: 'admin123' },
      manager: { email: 'manager@company.com', password: 'admin123' },
      'data-entry': { email: 'dataentry@company.com', password: 'admin123' },
    };

    try {
      await login({
        ...demoCredentials[role],
        rememberMe: false,
      });
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Demo login failed';
      setFormError(message);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || formError) && (
          <Alert variant="destructive">
            <AlertDescription>
              {formError || error}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading}
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </Label>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Demo Accounts (Password: admin123)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
              className="text-xs"
            >
              Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('manager')}
              disabled={isLoading}
              className="text-xs"
            >
              Manager
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin('data-entry')}
              disabled={isLoading}
              className="text-xs"
            >
              Data Entry
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="w-full text-center space-y-2">
          <Button
            variant="link"
            className="text-sm"
            onClick={() => {/* TODO: Implement forgot password */}}
          >
            Forgot your password?
          </Button>
          {onToggleMode && (
            <div className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" onClick={onToggleMode} className="p-0">
                Sign up
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}