import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Todo API',
    description: 'Description of My API',
  },
  host: 'localhost:8000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = [
  '../routes/auth.routes.ts',
  '../routes/todo.routes.ts',
];

swaggerAutogen(outputFile, routes, doc);
