import amqp from 'amqplib';
import { sendMessageToQueue, topicExchangePublisher } from '../../src/utils/messagePublisher';

jest.mock('amqplib');
jest.useFakeTimers();

describe('sendMessageToQueue', () => {
  it('should send a message to the RabbitMQ queue', async () => {
    // Arrange
    const mockCreateChannel = jest.fn();
    const mockAssertQueue = jest.fn();
    const mockSendToQueue = jest.fn();
    const mockClose = jest.fn();

    // Mock amqplib functions
    amqp.connect.mockResolvedValue({
      createChannel: mockCreateChannel,
      close: mockClose,
    });

    const mockChannel = {
      assertQueue: mockAssertQueue,
      sendToQueue: mockSendToQueue,
    };

    mockCreateChannel.mockResolvedValue(mockChannel);
    mockAssertQueue.mockResolvedValue(undefined);

    // Act
    const testMessage = {
      userId: 1,
      channelId: 23,
      title: "Testing Fake Channel"
    };
    await sendMessageToQueue(testMessage);
    jest.advanceTimersByTime(501); 

    // Assert
    expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost');
    expect(mockCreateChannel).toHaveBeenCalled();
    expect(mockAssertQueue).toHaveBeenCalledWith('video_notification', { durable: false });
    expect(mockSendToQueue).toHaveBeenCalledWith('video_notification', expect.any(Buffer));
    expect(mockClose).toHaveBeenCalled();
  });
  it('should send a message to the RabbitMQ Topic queue', async () => {
    // Arrange
    const mockCreateChannel = jest.fn();
    const mockAssertExchange = jest.fn();
    const mockPublish = jest.fn();
    const mockClose = jest.fn();

    // Mock amqplib functions
    amqp.connect.mockResolvedValue({
      createChannel: mockCreateChannel,
      close: mockClose,
    });

    const mockChannel = {
      assertExchange: mockAssertExchange,
      publish: mockPublish,
    };

    mockCreateChannel.mockResolvedValue(mockChannel);
    mockAssertExchange.mockResolvedValue(undefined);

    // Act
    const testMessage = {
      userId: 1,
      channelId: 23,
      title: 'Testing Fake Channel',
    };
    await  topicExchangePublisher(testMessage);
    jest.advanceTimersByTime(501);

    // Assert
    expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost');
    expect(mockCreateChannel).toHaveBeenCalled();
    expect(mockAssertExchange).toHaveBeenCalledWith('notifications', 'topic', {});
    expect(mockPublish).toHaveBeenCalledWith(
      'notifications',
      'notification.post.video',
      expect.any(Buffer),
      {}
    );
    expect(mockClose).toHaveBeenCalled();
  });
});