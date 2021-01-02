# You should use `gh repo create` from the [official GitHub CLI](https://github.com/cli/cli) instead of this

<hr />

# github-new

Create new GitHub repositories from the command line! Run `github-new` (or `ghn` for short) and this tool will create a new GitHub repository with the same name as the current folder and configure the `origin` remote to point at the new repo.

> If the current folder isn't a git repo, the tool will run `git init` first. You can disable this by passing `--no-init`

## Installation

```bash
npm install -g github-new
```

## Usage

```bash
# Create a repo for the authenticated user
github-new

# Create a repo for an organization
github-new --org my-org-name

# Do not initialize the current folder as a git repo
github-new --no-init
```
