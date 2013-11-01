////
// Talkwut registration module

var
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
    amqp = require('amqp'),
    ProtoBuf = require("protobufjs"),
    builder = ProtoBuf.protoFromFile("talkwut-protocol/core/registration.proto");

// Configuration params
var
    amqpHost = '192.168.9.118',
    twRegistrationQueue = 'talkwut-register',
    twUserName = 'giko',
    twPersonalQueue = 'tw-client-' + Math.random();


// Open amqp connection
var amqpConnection = amqp.createConnection({host: amqpHost});

amqpConnection.on('ready', function(){

    // Connect to exchange (create if not present)
    registrationExchange = amqpConnection.exchange('', {type: 'fanout',
                                autoDelete: false}, function(exchange){
    });

    // Create personal queue
    amqpConnection.queue(twPersonalQueue, {exclusive: true},
                     function(queue){

        console.log(' [*] Waiting for messages. To exit press CTRL+C')
        console.log(' [*] Personal queue has been created for this server: %s', twPersonalQueue)

        queue.subscribe(function(msg){                
            messageText = msg.data.toString('utf-8')
            socketioExchange.emit('message', { text: messageText });
          
            console.log(" [m] Message received: %s", messageText);
        });
    })


    var TwCore = builder.build("talkwut.core");
    var regRequest = new TwCore.RegistrationRequest(twUserName, twPersonalQueue);
    registrationExchange.publish(twRegistrationQueue, regRequest);
});

// ////
// // TODO:
// module.exports = {
//   foo: function () {
//     // whatever
//   },
//   bar: function () {
//     // whatever
//   }

// };

