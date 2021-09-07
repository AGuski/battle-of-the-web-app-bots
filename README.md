Battle of the Web App Bots
===============

This readme contains all the technical steps required to build a web app that lets you connect to the Battle of the Web App Bots Server to control your own bot.

***

I. The Basics
---------------	

To create a simple HTML Website, create an index.html:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bot Control</title>
  </head>
  <body>
    <h1 id="title">Hello Robot!</h1>
    <span>Welcome to the Battle of the Web App Bots Workshop.</span>
  </body>
</html>
```

Add some styles by grabbing a nice font and background color.

This will load fonts directly from Google. Add it in the `head` tags right after `</title>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap" rel="stylesheet">
```
Then create a `styles.css` file next to `index.html` and paste this inside:
```css
* {
  font-family: 'Play', sans-serif;
}

body {
  background-color: #e3ecfb;
}
```

And we also need a reference to the stylesheet in the `index.html`.
Paste it after the other `link` tags. 

*Important: The Browser only loads what is referenced by the index.html*
```html
<link href="styles.css" rel="stylesheet">
```

That covers HTML and CSS. Lets add a bit of JavaScript for completion.

Create a `src` folder with a `index.js` file inside.
Also this needs to be referenced in the `index.html`.
But now, put this file inside the `body` tags behind everything else. In this way, the Javascript will run after the html has been read.
```html
<script src="src/index.js"></script>
```

Inside the `index.js` we will write some JavaScript that changes the title in the html page.
```javascript
var myName = 'Your Name here!';

document.getElementById('title').innerHTML = `Hello ${myName}`;
```

Reload the file in the Browser and see the 🪄 happening.

**Concratulations, now you know HTML, CSS and Javascript!**

***

II. Make it interactive
---------------	

First, lets setup a first connection between your app and the Battle of the Web Bots server.

You can visit the server arena app at <https://battle-of-the-web-app-bots.glitch.me/>.

On the arena app, you register a new Bot. You will need the `Bot Code` of a registered bot to deploy it in the arena via your Web App.

Create an input field to enter the `Bot Code` and Button to deploy the Bot with that code.
By now, you should know where this goes:
```html
<div id="bot-deployment-interface">
  <h3>Bot Deployment Interface</h3>
  <label>
    Enter Bot Code: <input id="bot-code-input" type="text">
  </label>
  <button id="bot-deploy-button">Deploy the Bot!</button>
</div>
```

We will use some JavaScript to make these HTML Elements useful:
```javascript
/* get the Elements from the HTML */
var botCodeInput = document.getElementById('bot-code-input');
var botDeployButton = document.getElementById('bot-deploy-button');

/* listen to a click on the Button*/
botDeployButton.addEventListener('click', () => {
    const botCode = botCodeInput.value;

    /* We communicate to the server via Websockets */
    const socket = new WebSocket('wss://battle-of-the-web-app-bots.glitch.me/');
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'DEPLOY', id: botCode }));
    });
});
```

As we add more code like this, we might want to separate this into different files to keep things clean.

Create a `bot-deployment-interface.js` file in the `src` folder and move the Javascript that we just added to the `index.js` there.

To actually run, this code also needs to be referenced in the `index.html` after the `index.js`.
```html
<script src="src/bot-deployment-interface.js"></script>
```
**You see, that this can get tedious very fast... 😞**

There are multiple ways how we can "bundle" our Javascript in a way that the index.html only needs to load one or at least very few JavaScript files.

For all of them we need **Node.js**.

***

III. Node.js and Webpack
---------------	
Make sure you have Node.js installed.
If you haven't yet, get it at <https://nodejs.org/en/> and follow the install steps.
To check if it is installed open a terminal and enter
````
node --version
````
This should return you the version of Node.js that you have installed.

Node.js automatically comes with the **Node Package Manager** (NPM in short).
This tool allows you to install and manage all additional tools and libraries that are needed for this project inside the project folder.

NPM keeps track of everything related to your project via a `package.json` file.
To get started, open a terminal from your project folder and run:
````
npm init
````
This will guide you through the process of creating an initial `package.json` file.

**Remove the `"main"` entry from the package.json file.**

To bundle our JavaScript files properly, we will use [Webpack](https://webpack.js.org/).

Install webpack from the terminal via:
````
npm install webpack webpack-cli --save-dev
````

For convenience we can also add script command to the package.json `"scripts"` entry:
```json
  "build": "webpack"
```
Run it with
````
npm run build
````

By default, Webpack places bundles Javascript in a `dist` folder.
It looks like it only copied our main.js there. 
We need to add some configuration in form of a `webpack.config.js` file with the following content:
```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
```
Also we need to:
- Import the `bot-deployment.js` on top of the `index.js`.
```javascript
import './bot-deployment-interface';
```
- Remove the `script` tags from the `index.html` and only reference our entry javascript file that has been created by webpack:
```html
<script src="dist/bundle.js"></script>
```

Webpack also allows to bundle other files like CSS stylesheets.
For example also bundle stylesheets via webpack, we need to:

- install the `css-loader` and `style-loader`:
````
npm install --save-dev style-loader css-loader
````
- update the `webpack.config.js`:
```javascript
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```
and then instead of referencing the stylesheet in the `index.html`, move it to the `src` folder and import on top of the `index.js`:
```javascript
import './styles.css';
```

Lets make the automatic bundling even more convenient by letting Webpack automatically add the reference to our javascript bundle to the index.html:
- Install the `html-webpack-plugin`:
````
npm install --save-dev html-webpack-plugin
````
- Update the `webpack.config.js`:
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
```
- remove the `script` tags from the `body` of the `index.html` and move it into the `src` folder.

**Now Webpack also generates a `index.html` in the `dist` folder.
This is now what needs to be opened to see the app correctly.**

***

IV. Development Server
---------------	

To make building/compiling and running the app more convenient and to see how the app would behave if it where served from a real server we will set up a **Development Server**.

**Hint: You can also automatically rebuild the app by adding a `--watch` flag to the `webpack` command in the `package.json`.**

Luckily, Webpack has a Development Server available for us.
Istall it with
````
npm install --save-dev webpack-dev-server
`````

We now need to add this configuration to the `webpack.config.js` (as an property to `module.export` object):
```javascript
  devServer: {
    static: './dist',
  }
```
To run the Development Server in a convenient manner, lets add a new script to the `package.json`
```json
"start": "webpack serve --open"
```

**Awesome! Now whenever you update your code, webpack will rebundle the app and also update it in your browser.**

***

IV. Control your Bot
---------------	

To Control your bot, you need to add some code. But let's isolate the code that will communicate with the server, so you can use nice commands like: 
```javascript
turnLeft();
turnRight();
moveForward();
etc..
```

- Create a `bot-control.js` in the `src` folder, with this content:
```javascript
var socket;
var botCode;
export var botControl = {
  socket: socket,
  initialize: function (inputbotCode) {
    botCode = inputbotCode;
    socket = new WebSocket('wss://battle-of-the-web-app-bots.glitch.me/');
    socket.addEventListener("open", () => {
      console.log('send');
      socket.send(JSON.stringify({ type: "DEPLOY", id: botCode }));
    });
  },
  rotateLeft: function () {
    socket.send(
      JSON.stringify({ type: 'COMMAND', command: 'LEFT', botId: botCode })
    );
  },
  rotateRight: function () {
    socket.send(
      JSON.stringify({ type: 'COMMAND', command: 'RIGHT', botId: botCode })
    );
  },
  moveForward: function () {
    socket.send(
      JSON.stringify({ type: 'COMMAND', command: 'FORWARD', botId: botCode })
    );
  },
  moveBackward: function () {
    console.log('move:', botCode);
    socket.send(
      JSON.stringify({ type: 'COMMAND', command: 'BACKWARD', botId: botCode })
    );
  }
};
```
**This is a really, really oldschool way of doing this, but we'll make a nice and more modern version soon.**

We can now import `bot-control.js` in the `bot-deployment.js`:
```javascript
import { botControl } from './bot-control';
```
and replace the code in the `eventListener` function, so it looks like this:
```javascript
/* listen to a click on the Button*/
botDeployButton.addEventListener('click', () => {
    const botCode = botCodeInput.value;

    /* We communicate to the server via Websockets */
    botControl.initialize(botCode);
});
```

Now, we can also import and use `botControl` also in other places.
For example to implement a simple way of moving our bot with some buttons, lets add the buttons to the `index.html` in the `src` folder:
```html
<div id="bot-movement-interface">
  <h3>Bot Movement Control</h3>
  <div id="bot-move-buttons">
    <button id="move-forward">Move Forward</button>
    <div>
      <button id="turn-left">Turn Left</button>
      <button id="turn-right">Turn Right</button>
    </div>
    <button id="move-backward">Move Backward</button>
  </div>
</div>
```
- Add some styles to `styles.css`:
```css
#bot-move-buttons {
  display: flex;
  width: 200px;
  flex-direction: column;
}

#bot-move-buttons button {
  margin: 5px;
}

#turn-left {
  float: left;
}

#turn-right {
  float: right; 
}
```

- Import `botControl` to the `index.js`:
```javascript
import { botControl } from './bot-control';
```
- and add this code as well:
```javascript
document.getElementById('turn-left').addEventListener('click', () => {
    botControl.rotateLeft();
});
document.getElementById('turn-right').addEventListener('click', () => {
    botControl.rotateRight();
});
document.getElementById('move-forward').addEventListener('click', () => {
    botControl.moveForward();
});
document.getElementById('move-backward').addEventListener('click', () => {
    botControl.moveBackward();
});
```

Now you can control your bot.

***

V. Typescript and More Control
---------------	

To make controlling the bot more convenient I create a small library contained in a `Class`. But this is a **TypeScript** class:
```typescript
export class BotController {

  private socket: WebSocket;

  /**
   * Create a BotController with a valid control code to control a bot.
   */
  constructor(private controlCode: string) {
    this.socket = new WebSocket('wss://battle-of-the-web-app-bots.glitch.me/');
    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({ type: 'DEPLOY', id: this.controlCode }));
    });
  }
  /**
   * Rotates the bot counter clockwise until stopped.
   */
  rotateLeft() {
    this.sendCommand('LEFT');
  }

  /**
   * Rotates the bot clockwise until stopped.
   */
  rotateRight() {
    this.sendCommand('RIGHT');
  }

  /**
   * Stops any current rotation of the bot.
   */
  stopRotate() {
    this.sendCommand('STOP_ROTATE');
  }

  /**
   * Moves the bot forward until stopped.
   */
  moveForward() {
    this.sendCommand('FORWARD');
  }

  /**
   * Moves the bot backwards until stopped.
   */
  moveBackward() {
    this.sendCommand('BACKWARD');
  }

  /**
   * Stops any current directional movement of the bot.
   */
  stopMove() {
    this.sendCommand('STOP_MOVE');
  }

  /**
   * Shoots the laser until its charge is empty.
   * Will only shoot the laser if the charge is currently full.
   */
  pewPew() {
    this.sendCommand('TRIGGER_LASER');
  }

  private sendCommand(command: string) {
    this.socket.send(
      JSON.stringify({ type: 'COMMAND', command: command, botId: this.controlCode })
    );
  }
}
```
To use this class, we need to enable TypeScript for our project.

- Install the packages like before:
````
npm install --save-dev typescript ts-loader
````
- Add a `tsconfig.json` file to the root of your project with the content:
```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "module": "es6",
    "target": "es5",
    "allowJs": true,
    "moduleResolution": "node"
  }
}
```
- update the `webpack.config.js` to this:
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
```
- and rename your `index.js` to `index.ts`.

Now you can stop and restart the webpack dev server.

Copy the Typescript code from above and copy it in a new `bot-control.ts` file. You can delete the old `bot-control.js` file.



To make things a bit more easy, delete the `bot-deployment.js` import and import the `BotController`:
```typescript
import { BotController } from './bot-control';
```

Replace the code for the bot movment in the index.ts with this:
```typescript
var botCodeInput = document.getElementById('bot-code-input') as HTMLInputElement;
var botDeployButton = document.getElementById('bot-deploy-button');

let bot: BotController;

/* listen to a click on the Button*/
botDeployButton.addEventListener('click', () => {
    const botCode = botCodeInput.value;

    bot = new BotController(botCode);
});


document.getElementById('turn-left').addEventListener('click', () => {
    bot.rotateLeft();
});
document.getElementById('turn-right').addEventListener('click', () => {
    bot.rotateRight();
});
document.getElementById('move-forward').addEventListener('click', () => {
    bot.moveForward();
});
document.getElementById('move-backward').addEventListener('click', () => {
    bot.moveBackward();
});
```

**Add the missing control methods yourself!**

Alternatively you can control your bot with the keyboard:

```typescript
document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'w':
      bot.moveForward();
      break;
    case 's':
      bot.moveBackward();
      break;
    case 'a':
      bot.rotateLeft();
      break;
    case 'd':
      bot.rotateRight();
      break;
    case ' ':
      bot.pewPew();
      break;
    default:
      return;
  }
});

document.addEventListener('keyup', event => {
  switch (event.key) {
    case 'w':
    case 's':
      bot.stopMove();
      break;
    case 'a':
    case 'd':
      bot.stopRotate();
      break;
    default:
      return;
  }
});
```
