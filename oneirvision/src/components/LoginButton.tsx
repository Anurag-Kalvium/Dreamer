import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';

interface DecodedCredential {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

interface LoginButtonProps {
  text?: string;
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ 
  text = 'Get Started', 
  className = 'px-6 py-3 bg-gradient-to-r from-vivid-blue to-deep-purple text-white rounded-lg hover:shadow-lg transition-all'
}) => {
  const { login } = useAuth();

  const handleSuccess = (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        console.error('No credential received from Google');
        return;
      }
      
      const decoded = jwtDecode<DecodedCredential>(response.credential);
      
      // Extract user information from the decoded JWT
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      };
      
      // Update auth context with the user data
      login(userData);
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
