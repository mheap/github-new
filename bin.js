#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
  .option("pat", {
    type: "string",
    description:
      "GitHub Personal Access Token. Required if GITHUB_TOKEN env variable is not set",
  })
  .option("org", {
    type: "string",
    description: "If specified, the repo will be created in this organisation",
  })
  .option("init", {
    type: "boolean",
    description: "Do not attempt to initialise a new git repo",
    default: true,
  }).argv;

(async function (argv) {
  require(".")(argv);
})(argv);
