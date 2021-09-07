import { botControl } from './bot-control';

/* get the Elements from the HTML */
var botCodeInput = document.getElementById('bot-code-input');
var botDeployButton = document.getElementById('bot-deploy-button');

/* listen to a click on the Button*/
botDeployButton.addEventListener('click', () => {
    /* listen to a click on the Button*/
    botDeployButton.addEventListener('click', () => {
        const botCode = botCodeInput.value;

        /* We communicate to the server via Websockets */
        botControl.initialize(botCode);
    });
});