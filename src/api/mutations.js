const createIssueMutation = (repositoryId, title, body) => `
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

const createProjectMutation = (ownerId, name) => `
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

const linkProjectToRepositoryMutation = (projectId, repositoryId) => `
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

const addProjectItemMutation = (projectId, contentId) => `
  mutation {
    addProjectV2ItemById(input: {
      projectId: "${projectId}",
      contentId: "${contentId}"
    }) {
      item {
        id
      }
    }
  }
`;

const updateProjectItemStatusMutation = (projectId, itemId, fieldId, optionId) => `
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

module.exports = {
  createIssueMutation,
  createProjectMutation,
  linkProjectToRepositoryMutation,
  addProjectItemMutation,
  updateProjectItemStatusMutation
};