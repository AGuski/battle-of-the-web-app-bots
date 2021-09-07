import './styles.css';
import './bot-deployment-interface';
import { botControl } from './bot-control';


var myName = 'AlexBot';

document.getElementById('title').innerHTML = `Hello ${myName}`;

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