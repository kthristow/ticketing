import {Publisher, Subjects, TicketUpdatedEvent} from '@khtickets11/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
