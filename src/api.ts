window.navigator.userAgent = 'ReactNative';
const io = require('socket.io-client');

const steps = [];
// const url = 'ws://10.0.3.2:3000';
const url = 'wss://gomokus.herokuapp.com';

export type TypeConnect = 'server' | 'client';
export class ServerApi {
  socket;
  room;
  onUpdate;
  type: TypeConnect;

  constructor(type: TypeConnect) {
    this.type = type;
    this.socket = io.connect(url, {
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

  connect(room?) {
    if (this.type == 'server') {
      return this.create();
    }
    if (room) {
      return this.join(room);
    }
  }

  create() {
    return new Promise((resolve, reject) => {
      this.socket.emit('create', ({room}) => {
        if (room) {
          console.log('create room ', room);
          resolve(this.room = room);
        } else {
          reject();
        }
      });
    });
  }

  join(room) {
    this.room = room;
    return new Promise((resolve, reject) => {
      this.socket.emit('join', {room}, (data) => {
        if (data.room) {
          resolve(data.room);
        } else {
          this.disconnect();
          reject();
        }
      });
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

  disconnect() {
    this.socket.disconnect();
  }
}

function getRandom() {
  return Math.floor(Math.random() * 100);
}