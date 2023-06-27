import { Listener, ExpirationCompleteEvent, Subjects, OrderStatus } from '@tjudemytickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    // If order is not found, throw error
    if (!order) {
      throw new Error('Order not found');
    }

    // If order is already completed, do nothing
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // Otherwise, set order status to cancelled
    order.set({
      status: OrderStatus.Cancelled
    });

    // Save order
    await order.save();

    // Publish order cancelled event
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    msg.ack();
  }
}