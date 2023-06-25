import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Ticket } from '../models/ticket';

declare global {
  var signin: () => string[];
  var generateId: () => string;
  var createTicket: () => Promise<any>;
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {

  process.env.JWT_KEY = 'asdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});


}, 30_000);

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }

});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});


global.signin = () => {

  const payload = {
    id: global.generateId(),
    email: 'test@test.com'
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const base64 = Buffer.from(JSON.stringify(session)).toString('base64');

  return [`session=${base64}`];
};

global.generateId = () => {
  return new mongoose.Types.ObjectId().toHexString();
}

global.createTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  });

  await ticket.save();

  return ticket;
}
