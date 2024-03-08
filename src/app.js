import express from 'express';
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import setupDb from './db/db-setup.js';
import router from './routes/v1/index.js';
import ApiError from './utils/ApiError.js';
import morgan from 'morgan';
import logger from './config/logger.js';

const app = express();

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Swagger Redis Postgres Objection',
      version: '1.0.0',
    },
  },
  apis: ['./src/docs/*.yml','./src/routes/v1/*.js'],
};

// Swagger Docs Attached
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.json());

app.use('/v1', router);
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    next(err);
  }
})

setupDb((err) => {
  if (err) {
    logger.error('Error connecting to the database:', err);
    process.exit(1)
  }
});

export default app