import { Subjects, Publisher, ExpirationCompleteEvent } from '@tjudemytickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
