'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthUser } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  user: AuthUser;
}

interface NavigationItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    title: 'Data Entry',
    href: '/data-entry',
    icon: '📝',
  },
  {
    title: 'Import Data',
    href: '/import',
    icon: '📥',
  },
  {
    title: 'Data Management',
    href: '/data-management',
    icon: '🗃️',
    roles: ['admin', 'manager'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: '📈',
    roles: ['admin', 'manager'],
  },
  {
    title: 'User Management',
    href: '/users',
    icon: '👥',
    roles: ['admin'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: '⚙️',
  },
];

export function Navigation({ isOpen, onToggle, user }: NavigationProps) {
  const pathname = usePathname();

  const hasAccess = (item: NavigationItem): boolean => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'data-entry':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatRole = (role: string): string => {
    return role
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full bg-card border-r border-border transition-all duration-300 z-50',
          isOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">DP</span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">DataPro</h2>
                  <p className="text-xs text-muted-foreground">Professional</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-1.5"
            >
              <span className="sr-only">Toggle sidebar</span>
              {isOpen ? '←' : '→'}
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                <Badge
                  variant="secondary"
                  className={cn('text-xs mt-1', getRoleColor(user.role))}
                >
                  {formatRole(user.role)}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              if (!hasAccess(item)) return null;

              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  {isOpen && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {isOpen && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                © 2024 DataPro System
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                v1.0.0
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}