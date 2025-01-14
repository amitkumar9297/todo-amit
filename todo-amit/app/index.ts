import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose"
import dotenv from "dotenv"
// import cors from "cors";

import {initDB} from "./services/database.service"
import authRoutes from "./routes/auth.routes"
import todoRoutes from "./routes/todo.routes" 

dotenv.config();

// import morgan from "morgan";

const port = Number(process.env.PORT) || 8000;

const app: Express = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
// app.use(morgan("dev"));

app.use("/api/auth",authRoutes);
app.use("api/todos",todoRoutes);


// const initApp = async (): Promise<void> => {
//     await initDB();
//     // init mongodb
//     app.get("/",(req:Request,res:Response)=>{
//         res.send("welcome baack")
//     });
//     };

mongoose.connect("mongodb+srv://admin:75way123@cluster0.o8or1.mongodb.net/todo").then(()=>{
    console.log("DB connected");
}).catch((err)=>console.log(err));

app.listen(port,()=>{
    console.log(`server is runing on port ${port}`);
})

// void initApp()