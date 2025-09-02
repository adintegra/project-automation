const { executeGraphQL } = require('../api/client');
const { getOwnerAndRepoQuery } = require('../api/queries');

async function getOwnerAndRepoIds(ownerLogin, repoName) {
  try {
    const query = getOwnerAndRepoQuery(ownerLogin, repoName);
    const data = await executeGraphQL(query);
    
    const { repository } = data;
    return {
      ownerId: repository.owner.id,
      repositoryId: repository.id
    };
  } catch (error) {
    console.error(`Failed to get IDs for "${ownerLogin}/${repoName}":`, error.message);
    return null;
  }
}

module.exports = {
  getOwnerAndRepoIds
};