import React, { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleAuthWrapperProps {
  children: ReactNode;
}

const GoogleAuthWrapper: React.FC<GoogleAuthWrapperProps> = ({ children }) => {
  // Using environment variable for Google OAuth Client ID
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '403548239408-5utdvb54iu2bdfleohha1ttga34b2fst.apps.googleusercontent.com';

  if (!clientId) {
    console.error('Google OAuth Client ID is not configured');
    return <div>Google OAuth is not properly configured</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthWrapper;