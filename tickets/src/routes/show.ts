import express, { Request, Response } from 'express';
import { requireAuth,NotFoundError } from '@khtickets11/common';
import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if(!ticket){
        throw new NotFoundError();
    }

    res.send(ticket);
});

export { router as getTicketRouter };
