import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for my Express application',
        }, servers: [
            {
                url: 'http://localhost:5000', // URL of your server
            }
        ],
    },
    apis: ['../routes/**/*.js'], // This looks inside all subdirectories of routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const swaggerSetup = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
