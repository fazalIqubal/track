import React from 'react';
import Loadable from 'react-loadable';
import MainLayout  from './layout/MainLayout';
import MembershipPlan from './modules/membershipPlan/component/membershipPlan'
import UsersTable from './modules/users/component/users/users'
import TenantsList from './modules/tenant/component/tenants'
import userNewPassword from './modules/userNewPassword/userNewPassword'

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('./modules/dashboard/component/dashboard/dashboard'),
  loading: Loading,
});

const routes = [
  { path: '/', exact: true, name: 'Home', component: MainLayout, allowedRoles: ['admin'] },
  { path: '/userNewPassword', exact: true, name: 'userNewPassword', component: userNewPassword, allowedRoles: ['admin']},
  { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard, allowedRoles: ['admin'] },
  { path: '/membership-plan', exact: true, name: 'MembershipPlan', component: MembershipPlan, allowedRoles: ['admin'] },
  { path: '/users', exact: true, name: 'Users', component: UsersTable, allowedRoles: ['admin'] },
  { path: '/tenants', exact: true, name: 'Tenants', component: TenantsList, allowedRoles: ['admin'] },
];

export default routes;


