import express, { Request, Response } from 'express';
import { NotFoundError } from '@khtickets11/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets/', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({
        orderId: undefined
    });
    res.send(tickets);
});

export { router as indexTicketRouter };
