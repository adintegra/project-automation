const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

// Your personal access token from the .env file
const token = process.env.GITHUB_TOKEN;

// Repository details
const owner = process.env.REPO_OWNER;
const repo = process.env.REPO_NAME;
const projectName = process.env.PROJECT_TITLE || 'Simple Project Automation';

// Set up the request headers
const headers = {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28'
};

// Function to get owner and repository IDs for GraphQL API
async function getOwnerAndRepoIds(ownerLogin, repoName) {
  try {
    const query = `
      query {
        repository(owner: "${ownerLogin}", name: "${repoName}") {
          id
          owner {
            id
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    const { repository } = response.data.data;
    return {
      ownerId: repository.owner.id,
      repositoryId: repository.id
    };
  } catch (error) {
    console.error(`Failed to get IDs for "${ownerLogin}/${repoName}":`, error.response ? error.response.data : error.message);
    return null;
  }
}

// Function to create an issue with Todo label using GraphQL
async function createIssue(title, body, repositoryId) {
  try {
    const query = `
      mutation {
        createIssue(input: {
          repositoryId: "${repositoryId}",
          title: "${title}",
          body: "${body}",
          labelIds: []
        }) {
          issue {
            id
            title
            url
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    const issue = response.data.data.createIssue.issue;
    console.log(`Issue "${issue.title}" created successfully at ${issue.url}`);
    return issue.id; // Return the issue's GraphQL ID
  } catch (error) {
    console.error(`Failed to create issue "${title}":`, error.response ? error.response.data : error.message);
    return null;
  }
}

// Function to create a project using GraphQL API (Projects v2)
async function createProject(name, ownerId) {
  try {
    const query = `
      mutation {
        createProjectV2(input: {
          ownerId: "${ownerId}",
          title: "${name}"
        }) {
          projectV2 {
            id
            title
            url
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    const project = response.data.data.createProjectV2.projectV2;
    console.log(`Project "${project.title}" created successfully at ${project.url}`);
    return project.id;
  } catch (error) {
    console.error(`Failed to create project "${name}":`, error.response ? error.response.data : error.message);
    return null;
  }
}

// Function to get project status field information
async function getProjectStatusField(projectId) {
  try {
    const query = `
      query {
        node(id: "${projectId}") {
          ... on ProjectV2 {
            field(name: "Status") {
              __typename
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data.node.field;
  } catch (error) {
    console.error('Failed to get project status field:', error.response ? error.response.data : error.message);
    return null;
  }
}

// Function to update project item status
async function updateProjectItemStatus(projectId, itemId, fieldId, optionId) {
  try {
    const query = `
      mutation {
        updateProjectV2ItemFieldValue(
          input: {
            projectId: "${projectId}",
            itemId: "${itemId}",
            fieldId: "${fieldId}",
            value: {
              singleSelectOptionId: "${optionId}"
            }
          }
        ) {
          projectV2Item {
            id
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    console.log('Status updated to Todo successfully.');
    return true;
  } catch (error) {
    console.error('Failed to update project item status:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Function to add issue to project board
async function addIssueToProject(projectId, issueId) {
  try {
    const query = `
      mutation {
        addProjectV2ItemById(input: {
          projectId: "${projectId}",
          contentId: "${issueId}"
        }) {
          item {
            id
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    const item = response.data.data.addProjectV2ItemById.item;
    console.log(`Issue added to project successfully.`);
    return item.id;
  } catch (error) {
    console.error(`Failed to add issue to project:`, error.response ? error.response.data : error.message);
    return false;
  }
}

// Function to link project to repository
async function linkProjectToRepository(projectId, repositoryId) {
  try {
    const query = `
      mutation {
        linkProjectV2ToRepository(input: {
          projectId: "${projectId}",
          repositoryId: "${repositoryId}"
        }) {
          repository {
            name
          }
        }
      }
    `;

    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    console.log(`Project linked to repository "${response.data.data.linkProjectV2ToRepository.repository.name}" successfully.`);
    return true;
  } catch (error) {
    console.error(`Failed to link project to repository:`, error.response ? error.response.data : error.message);
    return false;
  }
}

// Main script execution
async function main() {
  const args = process.argv.slice(2);
  const createNewProject = args.includes('--create-project');
  const createIssues = args.includes('--create-issues');

  let projectId = null;
  let repositoryId = null;

  // Get repository IDs needed for both project and issue creation
  const ids = await getOwnerAndRepoIds(owner, repo);
  if (!ids) {
    console.error('Failed to get repository information. Exiting.');
    return;
  }
  repositoryId = ids.repositoryId;

  if (createNewProject) {
    console.log('Creating a new project...');
    // const projectName = process.env.PROJECT_TITLE || 'Simple Project Automation';

    projectId = await createProject(projectName, ids.ownerId);

    if (projectId) {
      console.log(`Project ID: ${projectId}`);

      // Link the project to the repository
      const linked = await linkProjectToRepository(projectId, repositoryId);
      if (linked) {
        console.log('Project successfully linked to repository.');
      }
    }
  }

  // Create issues and optionally link them to project
  if (createIssues) {
    console.log('Creating default issues...');
    const issueIds = [];

    const issue1Id = await createIssue('Issue 1', 'This is the first default issue.', repositoryId);
    if (issue1Id) issueIds.push(issue1Id);

    const issue2Id = await createIssue('Issue 2', 'This is the second default issue.', repositoryId);
    if (issue2Id) issueIds.push(issue2Id);

    const issue3Id = await createIssue('Issue 3', 'This is the third default issue.', repositoryId);
    if (issue3Id) issueIds.push(issue3Id);

    // If we also created a project, link the issues to it
    // if (createNewProject && projectId && issueIds.length > 0) {
    if (issueIds.length > 0) {
      if (!projectId) {
        console.log('No project ID found. Retrieving...');
        // Query to get the project ID
        const projectQuery = `
          query {
            user(login: "${owner}") {
              projectsV2(first: 100, query: "${projectName}") {
                nodes {
                  id
                  title
                }
              }
            }
          }
        `;

        const projectResponse = await axios.post(
          'https://api.github.com/graphql',
          { query: projectQuery },
          { headers }
        );

        if (projectResponse.data.errors) {
          throw new Error(`GraphQL errors: ${JSON.stringify(projectResponse.data.errors)}`);
        }

        projectId = projectResponse.data.data.user.projectsV2.nodes[0]?.id;
        console.log(`Retrieved project ID: ${projectId}`);
      }

      console.log('Linking issues to project...');
      
      // Get status field information
      const statusField = await getProjectStatusField(projectId);
      const todoOption = statusField?.options?.find(option => option.name === 'Todo');
      
      for (const issueId of issueIds) {
        const itemId = await addIssueToProject(projectId, issueId);
        
        // Set status to Todo if available
        if (itemId && statusField && todoOption) {
          await updateProjectItemStatus(projectId, itemId, statusField.id, todoOption.id);
        }
      }
    }
  }
}

main().catch(error => console.error('Error in execution:', error));
