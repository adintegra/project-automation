const axios = require('axios');
const { headers } = require('../config/github');

async function executeGraphQL(query) {
  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      { query },
      { headers }
    );

    if (response.data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data;
  } catch (error) {
    throw new Error(`GraphQL request failed: ${error.response ? error.response.data : error.message}`);
  }
}

module.exports = {
  executeGraphQL
};