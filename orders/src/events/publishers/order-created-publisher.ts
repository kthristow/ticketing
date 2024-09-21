import { OrderCreatedEvent, Publisher, Subjects } from "@khtickets11/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}