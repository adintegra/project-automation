const { executeGraphQL } = require('../api/client');
const { createIssueMutation } = require('../api/mutations');

async function createIssue(title, body, repositoryId) {
  try {
    const mutation = createIssueMutation(repositoryId, title, body);
    const data = await executeGraphQL(mutation);
    
    const issue = data.createIssue.issue;
    console.log(`Issue "${issue.title}" created successfully at ${issue.url}`);
    return issue.id;
  } catch (error) {
    console.error(`Failed to create issue "${title}":`, error.message);
    return null;
  }
}

module.exports = {
  createIssue
};