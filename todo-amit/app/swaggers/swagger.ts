import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';
import path from 'path';

const swaggerDir = path.join(__dirname, '../routes'); 
const outputDir = path.join(__dirname, '../swaggers'); 
const host = 'localhost:8000'; 

// Ensure the Swagger output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate Swagger files dynamically
fs.readdirSync(swaggerDir).forEach((file) => {
  if (file.endsWith('.ts')) {
    const routeName = file.replace('.routes.ts', '');
    const outputFile = path.join(outputDir, `swagger-${routeName}-output.json`);
    const doc = {
      info: {
        title: `${routeName.charAt(0).toUpperCase() + routeName.slice(1)} API`,
        description: `API documentation for ${routeName} routes`,
      },
      host,
      schemes: ['http'],
    };
    const routes = [path.join(swaggerDir, file)];
    swaggerAutogen(outputFile, routes, doc);
  }
});
