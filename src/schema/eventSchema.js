import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  breveDescripcion: {
    type:String,
    required:true,
  },
  fecha: {
    type: String,
    required: true,
  },
  hora:{
    type:String,
    required:true,
  },
  categoria:{
    type:String,
    required:true,
  },
  lugar: {
    type: String,
    required: true,
  },
  imagen:{
    type:String,
    required:true
  }
});

const Event = mongoose.model("Event", eventSchema);
export default Event;