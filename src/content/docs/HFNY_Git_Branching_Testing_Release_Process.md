# HFNY Git Branching, Testing, and Release Process

> ⚠️ **All feature branches must be created from `Staging`, not `Develop`.**

## Overview

HFNY uses two main branches in its repositories: `Develop` and `Staging`.

## Branch Overview

### Develop

The `Develop` branch is used for publishing to the Test Site. This branch contains feature work that is ready for testing.

### Staging

The `Staging` branch is the production branch. It should always represent the last known good version of the system in case a rollback is needed.

The `Staging` branch should never be updated directly. Instead, it is updated through a release branch created at the end of the week.

## Feature Development Process

1. Create your feature branch from `Staging`.
2. Complete development in your feature branch.
3. When your work is ready for review, create a pull request in GitHub targeting `Develop`.
4. Derek or Jay will review the pull request and provide feedback if needed.
5. If changes are requested, make the necessary updates in the same feature branch.
6. Once the pull request has been approved and merged into `Develop`, update both the C# and SQL repositories locally to the latest version of `Develop`.
7. If your branch includes SQL changes, those changes must be deployed to the server before publishing by using SQL Data Compare and/or SQL Compare.
8. After both repositories have been updated locally, and any required SQL changes have been deployed, publish the changes to the Test Site.

## Release Process

1. At the end of the week, Derek or Jay will create a release branch.
2. The release branch is used to prepare the changes that are ready for production.
3. Once the publish is complete, the release branch is merged into `Staging` the following Friday.
4. After the merge is complete, `Staging` becomes the new production version of the system.

## Important Notes

- All feature branches must start from `Staging`.
- Only work that is ready for testing should be merged into `Develop`.
- Developers should not publish from their feature branch.
- Before publishing to Test, both the C# and SQL repositories should be updated locally to the latest version of `Develop`.
- If a feature includes SQL changes, those changes must be deployed to the server before publishing by using SQL Data Compare and/or SQL Compare.
- `Staging` should never be updated directly.
- All production updates must go through a release branch.
