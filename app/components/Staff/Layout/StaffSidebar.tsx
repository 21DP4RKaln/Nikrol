'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Shield,
  Settings,
  Menu,
  X,
  Film,
  BarChart3,
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Пользователи',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Роли и права',
    href: '/admin/roles',
    icon: Shield,
  },
  {
    title: 'Фильмы',
    href: '/admin/movies',
    icon: Film,
  },
  {
    title: 'Статистика',
    href: '/admin/stats',
    icon: BarChart3,
  },
  {
    title: 'Настройки',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function StaffSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-30 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 lg:relative lg:translate-x-0',
          isCollapsed ? 'w-16' : 'w-64',
          'transform translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map(item => {
              const isActive = pathname.includes(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
