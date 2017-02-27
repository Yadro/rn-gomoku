window.navigator.userAgent = 'ReactNative';
const io = require('socket.io-client');

const steps = [];

export default class ServerApi {
  static url = 'ws://10.0.3.2:3000';
  socket;
  room;
  onUpdate;

  constructor() {
    this.socket = io.connect(ServerApi.url, {
      transports: ['websocket'] // you need to explicitly tell it to use websockets
    });

    this.socket.on('joined', ({room}) => {
      console.log('joined', room);
    });

    this.socket.on('start', (data) => {
      console.log('start', data);
    });

    this.socket.on('status', (data) => {
      if (data.status == 'active') {
        steps.push(data.position);
        this.onUpdate && this.onUpdate(data);
      }
    });
  }

  create() {
    this.socket.emit('create', ({room}) => {
      this.room = room;
      console.log('create room ', room);
    });
  }

  step(position) {
    return new Promise((resolve) => {
      this.socket.emit('step', {position}, resolve);
    });
  }

  subscribe(onUpdate) {
    this.onUpdate = onUpdate;
  }
}

function getRandom() {
  return Math.floor(Math.random() * 100);
}