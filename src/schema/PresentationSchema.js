// src/schema/PresentationSchema.js
import mongoose from "mongoose";

const PresentationSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Referencia al modelo Event
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: [
        "application/pdf", 
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        "application/vnd.ms-powerpoint", 
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", 
        "application/vnd.ms-excel", 
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        "image/png", 
        "image/jpeg", 
        "other"
      ],
      default: "other",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    uploadDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId, // ID del archivo en GridFS
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    tags: [{
      type: String,
    }],
    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Presentation = mongoose.model("Presentation", PresentationSchema);

export default Presentation;