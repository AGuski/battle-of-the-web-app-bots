import './styles.css';
import { BotController } from './bot-control';


var myName = 'AlexBot';

document.getElementById('title').innerHTML = `Hello ${myName}`;




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