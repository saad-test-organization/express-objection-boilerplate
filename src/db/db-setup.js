import knex from 'knex';
import knexfile from '../db/knexfile.js';
import { Model } from 'objection';

function setupDb(callback) {
  const db = knex(knexfile);
  Model.knex(db);

  db.raw('SELECT 1')
    .then(() => {
      callback(null);
    })
    .catch((error) => {
      callback(error);
    });
}

export default setupDb;
