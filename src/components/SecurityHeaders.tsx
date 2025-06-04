
import { useEffect } from 'react';

// Component to set security headers and CSP policies
const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy via meta tag for additional protection
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingCSP) {
      const cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      cspMeta.setAttribute('content', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: blob:; " +
        "connect-src 'self' https://*.supabase.co https://apis.google.com https://accounts.google.com wss://*.supabase.co; " +
        "frame-src 'self' https://accounts.google.com;"
      );
      document.head.appendChild(cspMeta);
    }

    // Set additional security headers via meta tags where possible
    const securityMetas = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { name: 'robots', content: 'noindex, nofollow' }, // Prevent indexing of the dashboard
    ];

    securityMetas.forEach(({ name, content }) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    });
  }, []);

  return null; // This component doesn't render anything
};

export default SecurityHeaders;
