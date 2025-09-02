const { executeGraphQL } = require('../api/client');
const { addProjectItemMutation, updateProjectItemStatusMutation } = require('../api/mutations');
const { getProjectStatusFieldQuery } = require('../api/queries');

async function getProjectStatusField(projectId) {
  try {
    const query = getProjectStatusFieldQuery(projectId);
    const data = await executeGraphQL(query);
    
    return data.node.field;
  } catch (error) {
    console.error('Failed to get project status field:', error.message);
    return null;
  }
}

async function addIssueToProject(projectId, issueId) {
  try {
    const mutation = addProjectItemMutation(projectId, issueId);
    const data = await executeGraphQL(mutation);
    
    const item = data.addProjectV2ItemById.item;
    console.log('Issue added to project successfully.');
    return item.id;
  } catch (error) {
    console.error('Failed to add issue to project:', error.message);
    return null;
  }
}

async function updateProjectItemStatus(projectId, itemId, fieldId, optionId) {
  try {
    const mutation = updateProjectItemStatusMutation(projectId, itemId, fieldId, optionId);
    await executeGraphQL(mutation);
    
    console.log('Status updated to Todo successfully.');
    return true;
  } catch (error) {
    console.error('Failed to update project item status:', error.message);
    return false;
  }
}

module.exports = {
  getProjectStatusField,
  addIssueToProject,
  updateProjectItemStatus
};