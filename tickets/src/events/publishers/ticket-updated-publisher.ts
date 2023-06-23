import { Publisher, Subjects, TicketUpdatedEvent } from '@tjudemytickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

