/// multer configuration

import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  // location to store the files recieved from frontend
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, "./src/storage");
  },
  // to store at what name it should be stored
  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, file.originalname + "_" + Date.now());
  },
});

export { multer, storage };
