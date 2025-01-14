import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose"
import dotenv from "dotenv"
import morgan from "morgan";
// import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import path from "path";
// const swaggerDocument = require('./swaggers/swagger-output.json');

// import {initDB} from "./services/database.service"
import authRoutes from "./routes/auth.routes"
import todoRoutes from "./routes/todo.routes" 

dotenv.config();


const port = Number(process.env.PORT) || 8000;

const app: Express = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/api/auth",authRoutes);
app.use("/api/todos",todoRoutes);
// app. use( '/api-docs' ,swaggerUi.serve, swaggerUi. setup(swaggerDocument) ) ;

// generate swagger files dynamically
// const swaggerDir = path.join(__dirname, "swaggers");
// fs.readdirSync(swaggerDir).forEach((file) => {
//     if (file.endsWith(".json")) {
//         const routeName = file.replace("swagger-", "").replace("-output.json", "");
//         const swaggerDocument = require(path.join(swaggerDir, file));
//         app.use(`/api-docs/${routeName}`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//     }
// });

const swaggerDir = path.join(__dirname, "swaggers"); // Directory containing Swagger JSON files

interface Tag {
  name: string;
  description: string;
}

interface Components {
  schemas?: Record<string, any>;
}

const baseSwaggerDoc: {
  swagger: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  host: string;
  schemes: string[];
  paths: any;
  tags: Tag[];
  components?: Components;  // Added components with schemas property
} = {
  swagger: "2.0",
  info: {
    title: "Combined API Documentation",
    description: "Documentation for all APIs",
    version: "1.0.0",
  },
  host: "localhost:8000",
  schemes: ["http"],
  paths: {},
  tags: [],
  components: {},  // Initialize components as an empty object
};

// Read each Swagger file in the directory and combine them
fs.readdirSync(swaggerDir).forEach((file) => {
  if (file.endsWith('.json')) {
    const swaggerFilePath = path.join(swaggerDir, file);
    const swaggerFileContent = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));

    // Determine the tag name based on the filename
    const tagName = file.replace('.json', '').replace('swagger-', '').replace('-output', '');
    baseSwaggerDoc.tags.push({
      name: tagName,
      description: swaggerFileContent.info.description || 'No description available',
    });

    // Add paths for this file to the base Swagger document
    Object.assign(baseSwaggerDoc.paths, swaggerFileContent.paths);

    // Merge components (schemas) if they exist
    if (swaggerFileContent.components?.schemas) {
      baseSwaggerDoc.components = {
        ...baseSwaggerDoc.components,
        schemas: {
          ...baseSwaggerDoc.components?.schemas,
          ...swaggerFileContent.components.schemas,
        },
      };
    }

    // Assign tags to the paths from this Swagger file
    Object.keys(swaggerFileContent.paths).forEach((path) => {
      Object.keys(swaggerFileContent.paths[path]).forEach((method) => {
        const operation = swaggerFileContent.paths[path][method];
        operation.tags = operation.tags || [];
        operation.tags.push(tagName);  // Add the tag to each operation
      });
    });
  }
});

// Serve the combined Swagger documentation at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(baseSwaggerDoc));



// const initApp = async (): Promise<void> => {
//     await initDB();
//     // init mongodb
//     
//     };

mongoose.connect("mongodb+srv://admin:75way123@cluster0.o8or1.mongodb.net/todo").then(()=>{
    console.log("DB connected");
}).catch((err)=>console.log(err));

app.get("/",(req:Request,res:Response)=>{
            res.send("welcome baack")
        });

app.listen(port,()=>{
    console.log(`server is runing on port ${port}`);
})

// void initApp()