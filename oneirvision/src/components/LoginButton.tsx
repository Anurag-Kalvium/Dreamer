import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

interface LoginButtonProps {
  text?: string;
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ 
  text = 'Get Started', 
  className = 'px-6 py-3 bg-gradient-to-r from-vivid-blue to-deep-purple text-white rounded-lg hover:shadow-lg transition-all'
}) => {
  const { loginWithGoogle } = useAuth();

  const handleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        console.error('No credential received from Google');
        return;
      }
      
      // Use the loginWithGoogle method from AuthContext
      await loginWithGoogle(response.credential);
    } catch (error) {
      console.error('Error decoding Google credential:', error);
    }
  };

  const handleError = () => {
    console.error('Google login failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      useOneTap
      theme="filled_blue"
      text="continue_with"
      shape="rectangular"
      logo_alignment="left"
    />
  );
};

export default LoginButton;
