const dotenv = require('dotenv');

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Server is shutting down...');
  console.log(err.name, err.message);
  // console.log(err)

  process.exit(1);
});

dotenv.config({ path: './config101.env' });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Server is shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
