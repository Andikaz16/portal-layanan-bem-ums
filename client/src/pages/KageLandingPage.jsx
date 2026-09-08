import React from 'react';

const KageLandingPage = () => {
  return (
    <iframe
      src="/landing-pages/kage.html?dpr=1&shadow=0&q=low"
      title="Layanan BEM UMS"
      allow="autoplay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default KageLandingPage;
