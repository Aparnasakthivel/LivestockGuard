const app = require('./app');

function listenWithFallback(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Backend server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
      server.close(() => listenWithFallback(port + 1));
      return;
    }

    console.error('Failed to start backend server', error);
    process.exit(1);
  });
}

function startServer() {
  const requestedPort = Number(process.env.PORT) || 5000;
  listenWithFallback(requestedPort);
}

process.on('SIGINT', () => {
  console.log('Shutting down backend server');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down backend server');
  process.exit(0);
});

startServer();
