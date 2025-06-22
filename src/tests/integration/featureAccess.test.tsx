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

describe('Feature-Specific Access Control', () => {
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

  describe('Loan Feature Access', () => {
    it('allows users to apply for loans', () => {
      renderApp('USER');
      fireEvent.click(screen.getByText(/loans/i));
      expect(screen.getByText(/apply for loan/i)).toBeInTheDocument();
    });

    it('allows admins to approve/reject loans', () => {
      renderApp('ADMIN');
      fireEvent.click(screen.getByText(/loan approvals/i));
      expect(screen.getByText(/approve/i)).toBeInTheDocument();
      expect(screen.getByText(/reject/i)).toBeInTheDocument();
    });

    it('restricts loan approval to admin/manager roles', () => {
      renderApp('USER');
      fireEvent.click(screen.getByText(/loans/i));
      expect(screen.queryByText(/approve/i)).not.toBeInTheDocument();
    });
  });

  describe('Chit Group Feature Access', () => {
    it('allows users to join chit groups', () => {
      renderApp('USER');
      fireEvent.click(screen.getByText(/chit groups/i));
      expect(screen.getByText(/join group/i)).toBeInTheDocument();
    });

    it('allows admins to create/manage chit groups', () => {
      renderApp('ADMIN');
      fireEvent.click(screen.getByText(/manage chit groups/i));
      expect(screen.getByText(/create group/i)).toBeInTheDocument();
      expect(screen.getByText(/edit group/i)).toBeInTheDocument();
    });

    it('restricts chit group management to admin role', () => {
      renderApp('MANAGER');
      fireEvent.click(screen.getByText(/chit groups/i));
      expect(screen.queryByText(/create group/i)).not.toBeInTheDocument();
    });
  });

  describe('Document Management Access', () => {
    it('allows users to upload their own documents', () => {
      renderApp('USER');
      fireEvent.click(screen.getByText(/documents/i));
      expect(screen.getByText(/upload document/i)).toBeInTheDocument();
    });

    it('allows admins to verify documents', () => {
      renderApp('ADMIN');
      fireEvent.click(screen.getByText(/document verification/i));
      expect(screen.getByText(/verify/i)).toBeInTheDocument();
    });

    it('restricts document verification to admin/manager roles', () => {
      renderApp('USER');
      fireEvent.click(screen.getByText(/documents/i));
      expect(screen.queryByText(/verify/i)).not.toBeInTheDocument();
    });
  });

  describe('Risk Assessment Access', () => {
    it('allows users to view their own risk score', () => {
      renderApp('USER');
      fireEvent.click(screen.getByText(/risk assessment/i));
      expect(screen.getByText(/your risk score/i)).toBeInTheDocument();
    });

    it('allows admins to view all risk assessments', () => {
      renderApp('ADMIN');
      fireEvent.click(screen.getByText(/risk assessment/i));
      expect(screen.getByText(/all risk assessments/i)).toBeInTheDocument();
    });

    it('restricts risk assessment management to admin/manager roles', () => {
      renderApp('USER');
      fireEvent.click(screen.getByText(/risk assessment/i));
      expect(screen.queryByText(/manage risk/i)).not.toBeInTheDocument();
    });
  });

  describe('User Management Access', () => {
    it('restricts user management to admin role only', () => {
      renderApp('MANAGER');
      expect(screen.queryByText(/manage users/i)).not.toBeInTheDocument();
    });

    it('allows admins to manage users', () => {
      renderApp('ADMIN');
      expect(screen.getByText(/manage users/i)).toBeInTheDocument();
    });
  });
}); 