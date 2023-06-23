import { Publisher, Subjects, TicketCreatedEvent } from '@tjudemytickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

