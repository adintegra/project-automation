require('dotenv').config();

const token = process.env.GITHUB_TOKEN;
const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;
const projectName = process.env.PROJECT_TITLE || 'Simple Project Automation';

const headers = {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28'
};

module.exports = {
  token,
  owner,
  repo,
  projectName,
  headers
};