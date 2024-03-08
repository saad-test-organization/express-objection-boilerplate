import amqp from 'amqplib';
import config from '../config/config.js';
import logger from '../config/logger.js';

const sendMessageToQueue = async (message) => {
    const connection = await amqp.connect(config.rabbitMqUrl);
    const channel = await connection.createChannel();
    const queueName = 'video_notification'; 
    await channel.assertQueue(queueName, { durable: false });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

    logger.info(`Message sent to RabbitMQ: ${JSON.stringify(message)}`);

    setTimeout(() => {
        connection.close();
    }, 500);
};

const topicExchangePublisher = async (message)=> {
    try {
    //   const rabbitmqUrl = "amqp://localhost";
      const connection = await amqp.connect(config.rabbitMqUrl);
      const exchange = "notifications";
      const exchangeType = "topic";
      const routingKey = "notification.post.video";
      const options = {};

      let channel = await connection.createChannel();
      await channel.assertExchange(exchange, exchangeType, options);
      channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        options
      );
      logger.info(`Message sent to RabbitMQ: ${JSON.stringify(message)}`);
      setTimeout(() => {
        connection.close();
    }, 500);
    } catch (error) {
      console.error(error);
    }
  }


export { sendMessageToQueue, topicExchangePublisher };
