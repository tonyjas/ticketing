import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher'; // Import the publisher class

console.clear();

const stan = nats.connect('ticketing', 'abc', { url: 'http://localhost:4222' });

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan); // Create an instance of the publisher class
  try {
    await publisher.publish({ // Call the publish method
      id: '1234',
      title: 'concert',
      price: 20
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // });

  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });

});