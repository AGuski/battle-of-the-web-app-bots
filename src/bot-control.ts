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