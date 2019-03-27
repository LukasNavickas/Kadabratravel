import { Mongo } from 'meteor/mongo';

export const Rates = new Mongo.Collection('rates');

Rates.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Rates.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

