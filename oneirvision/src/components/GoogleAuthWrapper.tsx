import React, { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleAuthWrapperProps {
  children: ReactNode;
}

const GoogleAuthWrapper: React.FC<GoogleAuthWrapperProps> = ({ children }) => {
  const clientId = '403548239408-5utdvb54iu2bdfleohha1ttga34b2fst.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthWrapper;
