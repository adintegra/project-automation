# GitHub Project Automation

A super simple, modular, PoC GitHub project setup automation tool that creates projects, issues, and sets project board statuses.

## Prerequisites

Create a personal [GitHub access token](https://github.com/settings/tokens) with `repo`, `user`, and `project` scopes.

From the [example](.env.example) provided, create an `.env` file with your desired configuration.

## Usage

```bash
# Create a new project
node src/index.js --create-project

# Create issues and add them to project with Todo status
node src/index.js --create-issues

# Both options can be combined
node src/index.js --create-project --create-issues
```

## Project Structure

```
src/
├── config/
│   └── github.js           # Environment variables and API configuration
├── api/
│   ├── client.js          # GraphQL client wrapper with error handling
│   ├── queries.js         # All GraphQL queries (repository, project, status fields)
│   └── mutations.js       # All GraphQL mutations (create, update, link operations)
├── services/
│   ├── repository.js      # Repository-related operations
│   ├── issues.js          # Issue creation and management
│   ├── projects.js        # Project creation, linking, and lookup
│   └── projectItems.js    # Project item operations (add items, update status)
└── index.js               # Main application logic and CLI argument handling
```

## Environment Variables

Create a `.env` file with:
```
GITHUB_TOKEN=your_github_token
REPO_OWNER=your_username_or_org
REPO_NAME=your_repository_name
PROJECT_TITLE=Your Project Name
```
