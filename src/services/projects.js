const { executeGraphQL } = require('../api/client');
const { createProjectMutation, linkProjectToRepositoryMutation } = require('../api/mutations');
const { getProjectByNameQuery } = require('../api/queries');
const { owner } = require('../config/github');

async function createProject(name, ownerId) {
  try {
    const mutation = createProjectMutation(ownerId, name);
    const data = await executeGraphQL(mutation);
    
    const project = data.createProjectV2.projectV2;
    console.log(`Project "${project.title}" created successfully at ${project.url}`);
    return project.id;
  } catch (error) {
    console.error(`Failed to create project "${name}":`, error.message);
    return null;
  }
}

async function linkProjectToRepository(projectId, repositoryId) {
  try {
    const mutation = linkProjectToRepositoryMutation(projectId, repositoryId);
    const data = await executeGraphQL(mutation);
    
    console.log(`Project linked to repository "${data.linkProjectV2ToRepository.repository.name}" successfully.`);
    return true;
  } catch (error) {
    console.error('Failed to link project to repository:', error.message);
    return false;
  }
}

async function findProjectByName(projectName) {
  try {
    const query = getProjectByNameQuery(owner, projectName);
    const data = await executeGraphQL(query);
    
    return data.user.projectsV2.nodes[0]?.id;
  } catch (error) {
    console.error('Failed to find project:', error.message);
    return null;
  }
}

module.exports = {
  createProject,
  linkProjectToRepository,
  findProjectByName
};