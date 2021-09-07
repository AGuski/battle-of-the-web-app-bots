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