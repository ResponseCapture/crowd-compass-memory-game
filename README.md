# CrowdCompass Memory Game

## Prerequisites

GIT and a github.com account
NodeJS v0.12.7 with NPM

## Install

Clone and browse in a terminal window to the root directory of the repository.  Then type the following command.

```
> npm install
```

## Development

This project uses webpack to build and deploy.  Install the build tool globally with the following command.

```
> npm install webpack -g && npm install webpack-dev-server -g
```

Once installed run a local dev server with the following command from the root directory of the repository:

```
> webpack-dev-server --inline --hot
```

## Deployment

Create a build with the following command from the root directory of the repository then commit your changes:

```
> webpack -p
```

Build files are committed to the repository.  For changes to appear at http://responsecapture.github.io/crowd-compass-memory-game, use the gh-pages branch. For production changes, use the master branch.