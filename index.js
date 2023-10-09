
const connectTODatabase = require('./db');

const amqp = require("amqplib/callback_api");

connectTODatabase();

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        let queue = 'fetchData';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            channel.ack(msg);
        }, {
            noAck: false
        });
    });
});