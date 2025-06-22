import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as authStore from '@/store/authStore';
import RoleGuard from '@/components/auth/RoleGuard';
import { vi } from 'vitest';

describe('RoleGuard', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when user has required role', () => {
    vi.spyOn(authStore, 'useAuthStore').mockReturnValue({
      user: {
        id: 'test-user-id',
        role: 'ADMIN',
      },
      isAuthenticated: true,
      setIntendedPath: vi.fn(),
    });

    renderWithRouter(
      <RoleGuard allowedRoles={['ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    vi.spyOn(authStore, 'useAuthStore').mockReturnValue({
      user: null,
      isAuthenticated: false,
      setIntendedPath: vi.fn(),
    });

    renderWithRouter(
      <RoleGuard allowedRoles={['ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/auth/login');
  });

  it('redirects to unauthorized page when user role is not allowed', () => {
    vi.spyOn(authStore, 'useAuthStore').mockReturnValue({
      user: {
        id: 'test-user-id',
        role: 'USER',
      },
      isAuthenticated: true,
      setIntendedPath: vi.fn(),
    });

    renderWithRouter(
      <RoleGuard allowedRoles={['ADMIN']}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/unauthorized');
  });

  it('allows access when user has one of the allowed roles', () => {
    vi.spyOn(authStore, 'useAuthStore').mockReturnValue({
      user: {
        id: 'test-user-id',
        role: 'MANAGER',
      },
      isAuthenticated: true,
      setIntendedPath: vi.fn(),
    });

    renderWithRouter(
      <RoleGuard allowedRoles={['ADMIN', 'MANAGER']}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('uses custom fallback path when provided', () => {
    vi.spyOn(authStore, 'useAuthStore').mockReturnValue({
      user: {
        id: 'test-user-id',
        role: 'USER',
      },
      isAuthenticated: true,
      setIntendedPath: vi.fn(),
    });

    renderWithRouter(
      <RoleGuard allowedRoles={['ADMIN']} fallbackPath="/custom-unauthorized">
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/custom-unauthorized');
  });
}); 