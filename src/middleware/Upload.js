// src/middleware/Upload.js
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import data from "../const/const.js";
import path from "path";

// Configuración de GridFS Storage con manejo de errores mejorado
const storage = new GridFsStorage({
  url: data.database,
  options: {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
  },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      try {
        // Validar tipo de archivo
        const allowedFileTypes = data.allowedFileTypes;
        
        if (!allowedFileTypes.includes(file.mimetype)) {
          return reject(new Error("Tipo de archivo no permitido. Solo se permiten archivos PDF, PowerPoint y Word."));
        }

        // Determinar el tipo de documento
        let fileType = "other";
        if (file.mimetype.includes("pdf")) {
          fileType = "pdf";
        } else if (file.mimetype.includes("powerpoint") || file.mimetype.includes("presentation")) {
          fileType = "powerpoint";
        } else if (file.mimetype.includes("word") || file.mimetype.includes("document")) {
          fileType = "word";
        } else if (file.mimetype.includes("excel") || file.mimetype.includes("spreadsheet")) {
          fileType = "excel";
        }

        const filename = `${Date.now()}_${file.originalname}`;
        
        resolve({
          bucketName: "presentations",
          filename: filename,
          metadata: {
            user: req.body.user || "anonymous",
            event: req.body.event,
            uploadDate: new Date(),
            originalName: file.originalname,
            fileType: fileType,
          },
        });
      } catch (error) {
        console.error("Error en la configuración de almacenamiento:", error);
        reject(error);
      }
    });
  },
});

// Configuración de multer con límites y manejo de errores
const upload = multer({
  storage,
  limits: {
    fileSize: data.maxFileSize, // Límite de tamaño de archivo
    files: 1, // Máximo 1 archivo por solicitud
  },
  fileFilter: (req, file, cb) => {
    try {
      // Validación de tipo de archivo
      if (data.allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Tipo de archivo no permitido. Solo se permiten archivos PDF, PowerPoint y Word."), false);
      }
    } catch (error) {
      cb(error);
    }
  },
});

// Middleware para manejar errores de multer
export const handleUploadErrors = (req, res, next) => {
  console.log("Iniciando carga de archivo...");
  
  const uploadMiddleware = upload.single("file");

  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error("Error en la carga de archivo:", err);
      
      if (err instanceof multer.MulterError) {
        // Error de multer
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error: `El archivo es demasiado grande. El tamaño máximo permitido es ${data.maxFileSize / (1024 * 1024)}MB`,
          });
        }
        return res.status(400).json({ error: err.message });
      } else {
        // Error personalizado
        return res.status(400).json({ error: err.message });
      }
    }
    
    console.log("Archivo cargado exitosamente:", req.file ? req.file.filename : "No file");
    next();
  });
};

export default upload;