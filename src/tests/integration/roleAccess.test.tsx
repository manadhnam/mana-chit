import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useAuthStore } from '@/store/authStore';
import App from '@/App';
import { vi } from 'vitest';

// Mock the auth store
vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Role-Based Access Control', () => {
  const renderApp = (userRole: string) => {
    (useAuthStore as any).mockReturnValue({
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: userRole,
      },
      isAuthenticated: true,
    });

    const store = configureStore({
      reducer: {
        // Add your reducers here if needed
      },
    });

    return render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  };

  describe('User Role Access', () => {
    it('allows access to user-specific pages', () => {
      renderApp('USER');

      // Check if user can access these pages
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/chit groups/i)).toBeInTheDocument();
      expect(screen.getByText(/loans/i)).toBeInTheDocument();
      expect(screen.getByText(/wallet/i)).toBeInTheDocument();

      // Check if user cannot access admin pages
      expect(screen.queryByText(/manage users/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/manage chit groups/i)).not.toBeInTheDocument();
    });

    it('restricts access to admin features', () => {
      renderApp('USER');

      // Try to access admin features
      fireEvent.click(screen.getByText(/loans/i));
      
      // Check if admin-specific actions are not available
      expect(screen.queryByText(/approve loan/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/reject loan/i)).not.toBeInTheDocument();
    });
  });

  describe('Admin Role Access', () => {
    it('allows access to admin-specific pages', () => {
      renderApp('ADMIN');

      // Check if admin can access these pages
      expect(screen.getByText(/manage users/i)).toBeInTheDocument();
      expect(screen.getByText(/manage chit groups/i)).toBeInTheDocument();
      expect(screen.getByText(/loan approvals/i)).toBeInTheDocument();
    });

    it('allows access to admin features', () => {
      renderApp('ADMIN');

      // Check if admin can access these features
      fireEvent.click(screen.getByText(/loan approvals/i));
      expect(screen.getByText(/approve loan/i)).toBeInTheDocument();
      expect(screen.getByText(/reject loan/i)).toBeInTheDocument();
    });
  });

  describe('Manager Role Access', () => {
    it('allows access to manager-specific pages', () => {
      renderApp('MANAGER');

      // Check if manager can access these pages
      expect(screen.getByText(/loan approvals/i)).toBeInTheDocument();
      expect(screen.getByText(/chit group management/i)).toBeInTheDocument();
      
      // Check if manager cannot access certain admin pages
      expect(screen.queryByText(/manage users/i)).not.toBeInTheDocument();
    });

    it('allows access to manager features', () => {
      renderApp('MANAGER');

      // Check if manager can access these features
      fireEvent.click(screen.getByText(/loan approvals/i));
      expect(screen.getByText(/approve loan/i)).toBeInTheDocument();
      expect(screen.getByText(/reject loan/i)).toBeInTheDocument();
    });
  });

  describe('Unauthenticated Access', () => {
    it('redirects to login page', () => {
      (useAuthStore as any).mockReturnValue({
        user: null,
        isAuthenticated: false,
      });

      renderApp('');

      // Check if redirected to login
      expect(screen.getByText(/login/i)).toBeInTheDocument();
      expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
    });
  });

  describe('Feature Access Control', () => {
    it('restricts loan approval based on role', async () => {
      renderApp('USER');

      // Try to access loan approval
      fireEvent.click(screen.getByText(/loans/i));
      fireEvent.click(screen.getByText(/view details/i));

      // Check if approval actions are not available
      expect(screen.queryByText(/approve/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/reject/i)).not.toBeInTheDocument();
    });

    it('allows loan approval for admin', async () => {
      renderApp('ADMIN');

      // Access loan approval
      fireEvent.click(screen.getByText(/loan approvals/i));

      // Check if approval actions are available
      expect(screen.getByText(/approve/i)).toBeInTheDocument();
      expect(screen.getByText(/reject/i)).toBeInTheDocument();
    });

    it('restricts chit group management based on role', () => {
      renderApp('USER');

      // Try to access chit group management
      fireEvent.click(screen.getByText(/chit groups/i));

      // Check if management actions are not available
      expect(screen.queryByText(/create group/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/edit group/i)).not.toBeInTheDocument();
    });
  });
}); 