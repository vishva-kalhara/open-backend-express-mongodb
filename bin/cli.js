#!/usr/bin/env node
/* eslint-disable node/shebang */

const { execSync } = require('child_process');

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

const gitCheckoutCommand = `git clone --depth 1 https://github.com/vishva-kalhara/open-backend-express-mongodb`;
const installDepsCommand = `npm install`;

console.log('Cloning the Repository');
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log('Installing dependancies...');
const idDepsInstalled = runCommand(installDepsCommand);
if (!idDepsInstalled) process.exit(-1);

console.log('Happy Hacking');
console.log(`npm start`);
