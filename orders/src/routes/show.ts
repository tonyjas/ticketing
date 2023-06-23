import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@tjudemytickets/common';
import { Order } from '../models/order';


import { body } from 'express-validator';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, [
  body('orderId')
    .not()
    .isEmpty()
    .withMessage('OrderId must be provided')
], validateRequest, async (req: Request, res: Response) => {

  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as showOrderRouter };
