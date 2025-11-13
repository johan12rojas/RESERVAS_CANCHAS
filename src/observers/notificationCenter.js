const EventEmitter = require('events');

class NotificationCenter extends EventEmitter {}

module.exports = new NotificationCenter();
