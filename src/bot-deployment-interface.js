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