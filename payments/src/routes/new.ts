import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@tjudemytickets/common';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments', requireAuth, [
  body('token')
    .not()
    .isEmpty()
    .withMessage('Token must be provided'),
  body('orderId')
    .not()
    .isEmpty()
    .withMessage('OrderId must be provided')
], validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    // Check if order belongs to current user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Check if order is cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    // Create charge with Stripe
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100, // convert to cents
      source: token
    });

    // Create payment record
    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    });

    await payment.save();

    // Publish payment created event
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };