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

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/vishva-kalhara/open-backend-express-mongodb ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log('Cloning the Repository');
const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) process.exit(-1);

console.log('Installing dependancies...');
const idDepsInstalled = runCommand(installDepsCommand);
if (!idDepsInstalled) process.exit(-1);

console.log('Happy Hacking');
console.log(`cd ${repoName} && npm start`);
