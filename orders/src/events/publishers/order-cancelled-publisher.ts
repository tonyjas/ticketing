import { Publisher, OrderCancelledEvent, Subjects } from '@tjudemytickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}