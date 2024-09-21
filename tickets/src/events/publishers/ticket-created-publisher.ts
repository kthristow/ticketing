import {Publisher, Subjects, TicketCreatedEvent} from '@khtickets11/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
