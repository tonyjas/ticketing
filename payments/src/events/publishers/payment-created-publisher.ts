import { Subjects, PaymentCreatedEvent, Publisher } from "@tjudemytickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}