import mongoose, { Schema, Document } from "mongoose";

export interface ITodo extends Document {
  title: string;
  description: string;
  assignedTo: mongoose.Types.ObjectId;
  status: "pending" | "completed";
}

const todoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>("Todo", todoSchema);