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