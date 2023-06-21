import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tjudemytickets/common';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@tjudemytickets/common';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  async (req: Request, res: Response) => {

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export { router as showTicketRouter };
