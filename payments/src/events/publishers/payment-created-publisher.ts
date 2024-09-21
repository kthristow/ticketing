import { PaymentCreatedEvent, Publisher, Subjects } from "@khtickets11/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}