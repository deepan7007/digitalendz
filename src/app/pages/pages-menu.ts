import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Asset Management',
    group: true,
  },
  {
    title: 'Server Management',
    icon: 'grid-outline',
    children: [
      {
        title: 'Servers',
        icon: 'layout',
        link: '/pages/servermgmt/server',
      },
      {
        title: 'Application Mapping',
        icon: 'map-outline',
        link: '/pages/servermgmt/appmap',
      },
      {
        title: 'Resource Utilization',
        icon: 'bar-chart-outline',
        link: '/pages/servermgmt/resutil',
      },
      {
        title: 'Lifecyle Mangement',
        icon: 'archive-outline',
        link: '/pages/servermgmt/lifecyle',
      },
      {
        title: 'Installed Softwares',
        icon: 'browser-outline',
        link: '/pages/servermgmt/softwares',
      }

    ],
  },
  {
    title: 'Employee Managment',
    icon: 'grid-outline',
    children:[
      {
      title: 'Search Employee',
      icon: 'layout',
      link: '/pages/hrms/onboard'
      }
    ]
  },
  {
    title: 'Leave Management',
    icon: 'grid-outline',
    children: [
      {
        title: 'Leave Dashboard',
        icon: 'layout',
        link: '/pages/hrms/leave/leavedashboard',
      },
      {
        title: 'Apply Leave',
        icon: 'layout',
        link: '/pages/hrms/leave/apply',
      },
    ]
  },
  {
    title: 'Security',
    icon: 'grid-outline',
    children: [
      {
        title: 'Roles',
        icon: 'layout',
        link: '/pages/security/roles',
      },
      {
        title: 'Users',
        icon: 'layout',
        link: '/pages/security/users',
      },
    ]
  },

  /*
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
  */
];
