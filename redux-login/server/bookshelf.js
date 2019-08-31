import knex from 'knex';
import bookshelf from 'bookshelf';
import knexConfig from '../knexfile';

const environment = process.env.NODE_ENV || 'development'
console.log(environment);

export default bookshelf(knex(knexConfig[environment]));
