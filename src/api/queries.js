const getOwnerAndRepoQuery = (ownerLogin, repoName) => `
  query {
    repository(owner: "${ownerLogin}", name: "${repoName}") {
      id
      owner {
        id
      }
    }
  }
`;

const getProjectByNameQuery = (owner, projectName) => `
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

const getProjectStatusFieldQuery = (projectId) => `
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

module.exports = {
  getOwnerAndRepoQuery,
  getProjectByNameQuery,
  getProjectStatusFieldQuery
};