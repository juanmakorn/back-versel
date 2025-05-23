// src/controller/presentationController.js
import Presentation from "../schema/PresentationSchema.js";
import mongoose from "mongoose";
import { getGfs } from "../conection/mongoconection.js";
import { ObjectId } from "mongodb";
export class PresentationController {
  // Obtener todas las presentaciones
  static async getPresentations(req, res) {
    try {
      const presentations = await Presentation.find().populate("event");
      res.status(200).json(presentations);
    } catch (error) {
      console.error("Error al obtener presentaciones:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener una presentación por ID
  static async getPresentation(req, res) {
    try {
      const presentation = await Presentation.findById(req.params.id).populate("event");
      if (!presentation) {
        return res.status(404).json({ error: "Presentación no encontrada" });
      }
      res.status(200).json(presentation);
    } catch (error) {
      console.error("Error al obtener presentación:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Crear una nueva presentación


static async createPresentation(req, res) {
  try {
    const gfs = await getGfs();

    if (!gfs) {
      return res.status(500).json({ error: "GridFS no está disponible aún" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No se ha enviado ningún archivo" });
    }

    const { file } = req;  

    const { user, event, format } = req.body;

    if (!user || !event || !format) {
      return res.status(400).json({
        error: "Todos los campos son requeridos",
        received: { user, event, format },
      });
    }

    // Creamos el stream de subida
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: {
        uploadedBy: user,
      },
    });

    // Escribimos el buffer en GridFS
    uploadStream.end(req.file.buffer);

    uploadStream.on("error", (err) => {
      console.error("Error subiendo archivo:", err);
      return res.status(500).json({ error: "Error al subir el archivo a GridFS" });
    });

    uploadStream.on("finish", async (uploadedFile) => {
      console.log("Archivo guardado con ID:", uploadStream.id);

      // Aquí ya podés guardar la referencia en tu colección Presentation
      const presentation = new Presentation({
        user: req.body.user,
        event: req.body.event,
        format: req.body.format,
        originalName: file.originalname,  // Nombre original del archivo
        filename: uploadStream.filename,  // El nombre del archivo cargado en GridFS
        fileSize: file.size,  // El tamaño del archivo
        fileType: file.mimetype,  // El tipo MIME del archivo
        uploadDate: new Date(), 
        fileId: uploadStream.id,  // Aquí usamos el ID del archivo subido
        description: req.body.description || '',
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      });
      try {
        const savedPresentation = await presentation.save();
        res.status(201).json({
          message: "Presentación subida exitosamente",
          presentation: savedPresentation
        });
      } catch (err) {
        console.error("Error al guardar la presentación:", err);
        res.status(500).json({ error: err.message });
      }
    });

    // Si hay un error al cargar el archivo
    uploadStream.on('error', (err) => {
      console.error("Error al cargar el archivo en GridFS:", err);
      res.status(500).json({ error: "Error al cargar el archivo en GridFS" });
    });

  } catch (error) {
    console.error("Error al crear presentación:", error);
    res.status(500).json({ error: error.message });
  }
}


  // Descargar una presentación
  static async downloadPresentation(req, res) {
    try {
      const presentation = await Presentation.findById(req.params.id);
      if (!presentation) {
        return res.status(404).json({ error: "Presentación no encontrada" });
      }

      const gfs = getGfs();
      if (!gfs) {
        return res.status(500).json({ error: "Error en el sistema de archivos" });
      }

      const fileId = new mongoose.Types.ObjectId(presentation.fileId);

      // Incrementar contador de descargas
      presentation.downloads = (presentation.downloads || 0) + 1;
      await presentation.save();

      // Configurar headers para descarga
      res.set("Content-Type", "application/octet-stream");
      res.set("Content-Disposition", `attachment; filename="${presentation.originalName}"`);

      const downloadStream = gfs.openDownloadStream(fileId);
      
      downloadStream.on("error", (error) => {
        console.error("Error al descargar archivo:", error);
        return res.status(404).json({ error: "Archivo no encontrado" });
      });

      downloadStream.pipe(res);
    } catch (error) {
      console.error("Error al descargar presentación:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Actualizar una presentación
  static async updatePresentation(req, res) {
    try {
      const { description, tags, status } = req.body;
      
      const updateData = {};
      if (description !== undefined) updateData.description = description;
      if (tags !== undefined) updateData.tags = tags.split(",").map(tag => tag.trim());
      if (status !== undefined) updateData.status = status;
      
      const presentation = await Presentation.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!presentation) {
        return res.status(404).json({ error: "Presentación no encontrada" });
      }

      res.status(200).json({ 
        message: "Presentación actualizada exitosamente", 
        presentation 
      });
    } catch (error) {
      console.error("Error al actualizar presentación:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Eliminar una presentación
  static async deletePresentation(req, res) {
    try {
      const presentation = await Presentation.findById(req.params.id);
      if (!presentation) {
        return res.status(404).json({ error: "Presentación no encontrada" });
      }

      // Eliminar archivo de GridFS
      const gfs = getGfs();
      if (gfs) {
        try {
          await gfs.delete(new mongoose.Types.ObjectId(presentation.fileId));
        } catch (error) {
          console.error("Error al eliminar archivo de GridFS:", error);
          // Continuar con la eliminación del documento aunque falle la eliminación del archivo
        }
      }

      // Eliminar documento de presentación
      await Presentation.findByIdAndDelete(req.params.id);

      res.status(200).json({ message: "Presentación eliminada exitosamente" });
    } catch (error) {
      console.error("Error al eliminar presentación:", error);
      res.status(500).json({ error: error.message });
    }
  }
}