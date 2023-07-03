import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError, currentUser } from '@tjudemytickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // Trust traffic as being secure even though it is coming from a proxy (ingress-nginx)
app.use(json());
app.use(cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== 'test', // Only send cookies over HTTPS if in production
    secure: false,
    name: 'session'
}));
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };