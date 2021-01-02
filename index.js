let { Octokit } = require("@octokit/rest");

const path = require("path");
const debug = require("debug")("github-new");
const simpleGit = require("simple-git");
const git = simpleGit();

const shouldUseHttpRemote = require("./shouldUseHttpRemote");

module.exports = async function (argv) {
  // Set up auth
  const token = argv.pat || process.env.GITHUB_TOKEN;

  // Cache useful args
  const org = argv.org;
  const repo = path.basename(path.resolve());

  // Initialise a repo if we need to
  // Unless --no-init is passed
  if (!(await git.checkIsRepo())) {
    debug("$ git init");
    if (!argv.init) {
      console.error("Current folder is not a git repository");
      return;
    }
    await git.init();
  }

  // If there's already a remote, bail out
  try {
    const remotes = await git.getRemotes();
    const originRemote = remotes.find((r) => r.name == "origin");
    if (originRemote) {
      console.error("Remote [origin] found, exiting.");
      return;
    }
  } catch (e) {
    // No remotes, we can continue
  }

  // Create Octokit instance
  const octokit = new Octokit({
    auth: token,
  });

  // Create a new repo
  let createdRepo;
  try {
    if (org) {
      ({ data: createdRepo } = await octokit.repos.createInOrg({
        org,
        name: repo,
      }));
    } else {
      ({ data: createdRepo } = await octokit.repos.createForAuthenticatedUser({
        name: repo,
      }));
    }
  } catch (e) {
    // Does this repo already exist for the specified user?
    // If so, log and exit.
    console.error(e.message);
    return;
  }

  // Configure local remote
  let remote = createdRepo.ssh_url;
  if (shouldUseHttpRemote()) {
    remote = createdRepo.clone_url;
  }

  debug(`$ git remote add origin ${remote}`);
  await git.addRemote("origin", remote);
};
