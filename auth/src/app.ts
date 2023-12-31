import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@tjudemytickets/common';

const app = express();
app.set('trust proxy', true); // Trust traffic as being secure even though it is coming from a proxy (ingress-nginx)
app.use(json());
app.use(cookieSession({
    signed: false,
    //secure: process.env.NODE_ENV !== 'test' // Only send cookies over HTTPS if in production
    secure: false
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(errorHandler);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

export { app };