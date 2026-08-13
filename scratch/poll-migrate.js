const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function pollMigrate() {
  console.log('Polling migration endpoint...');
  while (true) {
    try {
      const res = await fetch('https://portal-layanan-bem-ums.vercel.app/api/v1/migrate');
      const data = await res.json();
      console.log('Status:', res.status, 'Response:', data);
      
      if (res.status === 200 && data.success) {
        console.log('Migration successful on Vercel!');
        break;
      } else if (res.status === 404) {
        console.log('Endpoint not found yet, waiting 10s...');
      } else {
        console.log('Unexpected response, waiting 10s...');
      }
    } catch (err) {
      console.error('Error fetching:', err.message);
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

pollMigrate();
