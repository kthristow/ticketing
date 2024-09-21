import { OrderCancelledEvent, Publisher, Subjects } from "@khtickets11/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}