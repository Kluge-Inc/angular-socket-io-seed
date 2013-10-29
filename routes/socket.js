/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  socket.emit('send:name', {
    name: 'Bob'
  });

  socket.emit('message', { text: '~= talkwut server initialized, connected =~' });

  socket.on('message', function (data) {
    console.log(" [s] Message received from socket: %s", data);
    exchangeGlobal.publish('', data);
  });

};
