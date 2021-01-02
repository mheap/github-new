const fs = require("fs");

const simpleGit = require("simple-git");
const git = simpleGit();

const homeDir = require("os").homedir();

function shouldUseHttpRemote() {
  if (checkNetRc()) {
    return true;
  }

  if (checkGitCredentials()) {
    return true;
  }

  return false;
}

function checkNetRc() {
  const content = loadFile(homeDir + "/.netrc");
  return content && content.includes("machine github.com");
}

function checkGitCredentials() {
  const content = loadFile(homeDir + "/.git-credentials");
  return content && content.match(/https:\/\/api:.*@github.com/);
}

function loadFile(path) {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path);
  }
}

module.exports = shouldUseHttpRemote;
