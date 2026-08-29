import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import  OwnerDashboardPage  from '@/pages/OwnerDashboardPage'
import CompanyDashboardPage  from '@/pages/CompanyDashboardPage'
import  CompanyCreatePage from '@/pages/CompanyCreatePage'
import  CompanyLoginPage  from '@/pages/CompanyLoginPage'
import  ResearchCreatePage  from '@/pages/ResearchCreatePage'
import  ResearchResultPage  from '@/pages/ResearchResultPage'
import  GuestResearchPage  from '@/pages/GuestResearchPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { useAuth } from '@/hooks/useAuth'

function OwnerRoute() {
  const { owner } = useAuth()
  return owner.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function CompanyRoute() {
  const { company } = useAuth()
  return company.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function PublicRoute() {
  const { company } = useAuth()
  return company.isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/guest-research',
    element: <GuestResearchPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
        ],
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      // Owner-only routes
      {
        element: <OwnerRoute />,
        children: [
          { path: '/app', element: <OwnerDashboardPage /> },
          { path: '/app/companies', element: <OwnerDashboardPage /> },
          { path: '/app/companies/new', element: <CompanyCreatePage /> },
          { path: '/app/company/:companyId/login', element: <CompanyLoginPage /> },
        ],
      },
      // Company workspace routes
      {
        element: <CompanyRoute />,
        children: [
          { path: '/app/company/:companyId', element: <CompanyDashboardPage /> },
          { path: '/app/company/:companyId/research/new', element: <ResearchCreatePage /> },
          {
  path: '/app/company/:companyId/research/:researchId',
  element: <ResearchResultPage />
},
          // BACKEND GAP: Individual research detail page
          // { path: '/app/company/:companyId/research/:researchId', element: <ResearchDetailPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])


