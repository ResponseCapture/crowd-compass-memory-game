# CrowdCompass Memory Game

## Prerequisites

GIT and a github.com account
NodeJS v0.12.7 with NPM

How to use GIT:
https://try.github.io/levels/1/challenges/1

## Install

Clone and browse in a terminal window to the root directory of the repository.  Then type the following command.

```
> npm install
```

## Development

This project uses webpack to build and deploy.  Install the build tool globally with the following command then browse to http://localhost:8080.

```
> npm install webpack -g && npm install webpack-dev-server -g
```

Once installed run a local dev server with the following command from the root directory of the repository:

```
> webpack-dev-server --inline --hot
```

## Integration

1. Copy index.html into the campain editor.

2. Reference the app.js in index.html from the master branch in github.  Here's the link: https://raw.githubusercontent.com/ResponseCapture/crowd-compass-memory-game/master/assets/app.js


3. Move the two sprite images from assets folder to relative path of the site.  (e.g. /assets/sprite.png and sprite@2x.jpg)


```
window.responseCapture = {
  updateUser: function (data) {
      /* Data Object
        {
          firstName: string,
          lastName: string,
          email: string,
          workEmail: string,
          companyName: string,
          levelComplete: string,
          unlockedAssets: bool,
          numberOfPlays: int
        }
      */

      //sudo code
      $.ajax({
        url: '/Quiz',
        type: 'POST',
        data: data
      });
    },
    facebookShare: function (results) {
      if (results) {
        //share from results
      } else {
        //share from sidebar
      }
    },
    linkedinShare: function (results) {
      //same as facebookShare
    },
    pinterestShare: function (results) {
      //same as facebookShare
    },
    twitterShare: function (results) {
      //same as facebookShare
    }
  }
}
```

## Deployment

Create a build with the following command from the root directory of the repository then commit your changes:

```
> webpack -p
```

Build files are committed to the repository.  For changes to appear at http://responsecapture.github.io/crowd-compass-memory-game, use the gh-pages branch. For production changes, use the master branch.