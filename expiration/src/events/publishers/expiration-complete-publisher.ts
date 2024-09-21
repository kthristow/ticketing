import { ExpirationCompleteEvent, Publisher, Subjects } from "@khtickets11/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    
}