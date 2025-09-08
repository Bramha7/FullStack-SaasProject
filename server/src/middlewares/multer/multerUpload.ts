import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { storage } from "../../services/cloudinary.config";

const upload = multer({
  storage: storage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are supported"));
    }
  },
});

export default upload;
