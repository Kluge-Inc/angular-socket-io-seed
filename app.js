
/**
 * Module dependencies
 */

var 
  express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  amqp = require('amqp');

// Initialize server
var 
  app = module.exports = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);
  
///
/// AMQP Configuration params
var
  amqpHost = 'localhost',
  twIncomingQueue = 'talkwut-global';

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
socketioExchange = io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


/// AMQP connection
///

// Open amqp connection
var amqpConnection = amqp.createConnection({host: amqpHost});

amqpConnection.on('ready', function(){
    
    // Generate unique queue name for server
    servQueueName = 'tw-server-' + Math.random();

    // Connect to exchange (create if not present)
    exchangeGlobal = amqpConnection.exchange(twIncomingQueue, {type: 'fanout',
                                autoDelete: false}, function(exchange){
        
        // Create personal queue
        amqpConnection.queue(servQueueName, {exclusive: true},
                         function(queue){
            // Subscribe to global exchange
            queue.bind(twIncomingQueue, '');
            console.log(' [*] Waiting for messages. To exit press CTRL+C')
            console.log(' [*] Personal queue has been created for this server: %s', servQueueName)

            queue.subscribe(function(msg){                
                messageText = msg.data.toString('utf-8')
                socketioExchange.emit('message', { text: messageText });
              
                console.log(" [m] Message received: %s", messageText);
            });
        })
    });

    helloMessage = 'Talkwut node connected: ' + servQueueName;
    exchangeGlobal.publish('', helloMessage);

});
