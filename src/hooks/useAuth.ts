import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useSupabaseStore } from '@/store/supabaseStore';

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, signIn, signOut, updateUser } = useSupabaseStore();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          useSupabaseStore.setState({ user: data });
        }
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && data) {
            useSupabaseStore.setState({ user: data });
          }
        } else if (event === 'SIGNED_OUT') {
          useSupabaseStore.setState({ user: null });
          navigate('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      await updateUser(userId, data);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateUser: handleUpdateUser,
  };
}; 