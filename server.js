const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Server is shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: './config.env' });

// Replace Password string
const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);

// Connect to DB
async function dbConnect() {
  await mongoose.connect(DB);
}
dbConnect().then(() => console.log('Connected to DB...'));

// Starting the Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Handling unhandled Errors
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Server is shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
