window.navigator.userAgent = 'ReactNative';
const io = require('socket.io-client');

const steps = [];
// const url = 'ws://10.0.3.2:3000';
const url = 'wss://gomokus.herokuapp.com';

export class ServerApi {
  socket;
  room;
  onUpdate;

  constructor() {
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

  create() {
    return new Promise((resolve) => {
      this.socket.emit('create', ({room}) => {
        console.log('create room ', room);
        resolve(this.room = room);
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
}

export class ClientApi {
  socket;
  room;
  onUpdate;

  constructor() {
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

  join(room) {
    this.room = room;
    this.socket.emit('join', {room}, () => {
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