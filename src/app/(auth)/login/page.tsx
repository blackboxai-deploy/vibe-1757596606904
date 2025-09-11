'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-primary rounded-xl flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary-foreground rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">DataPro</h1>
          <p className="text-muted-foreground">Professional Data Entry System</p>
        </div>

        {isLoginMode ? (
          <LoginForm onToggleMode={toggleMode} />
        ) : (
          <RegisterForm onToggleMode={toggleMode} />
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 DataPro. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button className="hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button className="hover:text-foreground transition-colors">
              Terms of Service
            </button>
            <span>•</span>
            <button className="hover:text-foreground transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}