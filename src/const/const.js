// src/const/const.js
const data = {
  // agregar codigo de wpp
   port: process.env.PORT || 3000,
    database: process.env.MONGODB_URI || "mongodb+srv://finalproyecto36:y6dlfVLIT3WW6qap@cluster0.k0c5szm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    secret: process.env.JWT_SECRET || "secret123",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh_secret456",
    tokenExpiry: process.env.TOKEN_EXPIRY || "1h",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    environment: process.env.NODE_ENV || "development",
    allowedFileTypes: [
      // PDF
      "application/pdf",
      // PowerPoint
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      // Word
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Excel (opcional)
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    maxFileSize: process.env.MAX_FILE_SIZE || 20 * 1024 * 1024, // 20MB por defecto
  };
  
  export default data;