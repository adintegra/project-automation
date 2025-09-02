const { owner, repo, projectName } = require('./config/github');
const { getOwnerAndRepoIds } = require('./services/repository');
const { createIssue } = require('./services/issues');
const { createProject, linkProjectToRepository, findProjectByName } = require('./services/projects');
const { getProjectStatusField, addIssueToProject, updateProjectItemStatus } = require('./services/projectItems');

async function main() {
  const args = process.argv.slice(2);
  const createNewProject = args.includes('--create-project');
  const createIssues = args.includes('--create-issues');

  let projectId = null;
  let repositoryId = null;

  const ids = await getOwnerAndRepoIds(owner, repo);
  if (!ids) {
    console.error('Failed to get repository information. Exiting.');
    return;
  }
  repositoryId = ids.repositoryId;

  if (createNewProject) {
    console.log('Creating a new project...');
    projectId = await createProject(projectName, ids.ownerId);

    if (projectId) {
      console.log(`Project ID: ${projectId}`);
      const linked = await linkProjectToRepository(projectId, repositoryId);
      if (linked) {
        console.log('Project successfully linked to repository.');
      }
    }
  }

  if (createIssues) {
    console.log('Creating default issues...');
    const issueIds = [];

    const issue1Id = await createIssue('Issue 1', 'This is the first default issue.', repositoryId);
    if (issue1Id) issueIds.push(issue1Id);

    const issue2Id = await createIssue('Issue 2', 'This is the second default issue.', repositoryId);
    if (issue2Id) issueIds.push(issue2Id);

    const issue3Id = await createIssue('Issue 3', 'This is the third default issue.', repositoryId);
    if (issue3Id) issueIds.push(issue3Id);

    if (issueIds.length > 0) {
      if (!projectId) {
        console.log('No project ID found. Retrieving...');
        projectId = await findProjectByName(projectName);
        console.log(`Retrieved project ID: ${projectId}`);
      }

      console.log('Linking issues to project...');
      
      const statusField = await getProjectStatusField(projectId);
      const todoOption = statusField?.options?.find(option => option.name === 'Todo');
      
      for (const issueId of issueIds) {
        const itemId = await addIssueToProject(projectId, issueId);
        
        if (itemId && statusField && todoOption) {
          await updateProjectItemStatus(projectId, itemId, statusField.id, todoOption.id);
        }
      }
    }
  }
}

main().catch(error => console.error('Error in execution:', error));