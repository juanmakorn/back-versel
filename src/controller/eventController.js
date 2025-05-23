import Event from "../schema/eventSchema.js";
import { converterController } from "./ConverterController.js";

export class eventController {
  static async getEventos(req, res) {
    try {
      const eventos = await Event.find();
      res.status(200).json(eventos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async postEventos (req, res) {

    try {
    
      const { title, descripcion, breveDescripcion, fecha,hora,categoria,lugar } = req.body;
 
      if (!title || !descripcion || !breveDescripcion || !fecha || !hora || !categoria || !lugar || !req.file) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const res = await converterController(req.file)
     let imagen = res.url
      const event = new Event({ title, descripcion, breveDescripcion, fecha,hora,categoria,lugar,imagen });
  
      await event.save();
    } catch (error) {
     
      res.status(400).json({ error: error.message });
    }
    res.status(200).send({message: 'Evento creado de manera exitosa!'})
  }

  static async getEventoById(req, res) {
    try {
      const evento = await Event.findById(req.params.id);
      if (!evento) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }
      res.status(200).json(evento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateEvento(req, res) {
    try {
      const { title, description, date, location } = req.body;
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { title, description, date, location },
        { new: true },
      );

      if (!updatedEvent) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }

      res.status(200).json({ message: "Evento actualizado exitosamente", event: updatedEvent });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteEvento(req, res) {
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);

      if (!deletedEvent) {
        return res.status(404).json({ error: "Evento no encontrado" });
      }

      res.status(200).json({ message: "Evento eliminado exitosamente" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}