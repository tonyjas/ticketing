import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim() // Remove spaces
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest, 
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new BadRequestError('Email in use');
    }
    
    const user = User.build({ email, password });
    await user.save();
    
    // Generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, 
    process.env.JWT_KEY!
    ); // The ! tells TypeScript that we know for sure that JWT_KEY is defined

    // Store it on session object
    req.session = { 
      jwt: userJwt
    };

    res.status(201).send(user);

  });

export { router as signupRouter };