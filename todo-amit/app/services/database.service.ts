import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
export const initDB= async() : Promise<void> =>{
    try{
        await mongoose.connect("mongodb+srv://admin:75way123@cluster0.o8or1.mongodb.net/todo");
        console.log("connect database succesfuly");
    }
    catch(error){
        console.log(error);
    }
}