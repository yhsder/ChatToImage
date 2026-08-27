import { createFileRoute, Outlet } from '@tanstack/react-router';
import {
  Coins,
  CreditCard,
  History,
  Home,
  Key,
  LayoutDashboard,
  LifeBuoy,
  Receipt,
  User,
} from 'lucide-react';

import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { SupportWidget } from '@/blocks/support-widget';
import { AppLayout } from '@/components/app-layout';

export const Route = createFileRoute('/settings')({
  component: SettingsLayout,
});

function SettingsLayout() {
  const group = m['common.systems.settings']();
  const navItems = [
    {
      href: '/settings',
      label: m['settings.nav.overview'](),
      icon: LayoutDashboard,
      group,
    },
    {
      href: '/settings/billing',
      label: m['settings.nav.billing'](),
      icon: CreditCard,
      group,
    },
    {
      href: '/settings/payments',
      label: m['settings.nav.payments'](),
      icon: Receipt,
      group,
    },
    {
      href: '/settings/credits',
      label: m['settings.nav.credits'](),
      icon: Coins,
      group,
    },
    {
      href: '/settings/history',
      label: m['settings.nav.history'](),
      icon: History,
      group,
    },
    {
      href: '/settings/apikeys',
      label: m['settings.nav.apikeys'](),
      icon: Key,
      group,
    },
    {
      href: '/settings/tickets',
      label: m['settings.nav.tickets'](),
      icon: LifeBuoy,
      group,
    },
  ];

  const footerNavItems = [
    {
      href: '/settings/profile',
      label: m['settings.nav.profile'](),
      icon: User,
    },
    { href: '/', label: m['common.systems.home'](), icon: Home, newTab: true },
  ];

  return (
    <AppLayout
      navItems={navItems}
      footerNavItems={footerNavItems}
      brand={envConfigs.app_name}
      brandHref="/settings"
    >
      <Outlet />
      <SupportWidget />
    </AppLayout>
  );
}
