/*

REGISTER/SIGNUP
incoming data  --> username, email, password 
processing/checking --> email valid, compulsory data aaaunu paryo 
db--> table--> query --> table ma insert/read/delete/update

LOGIN/SIGNIN
LOGOUT
FORGOT PASSWORD 
RESET PASSWORD/ OTP

*/
import jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import User from "../../../database/Models/userModel";
import bcryptjs from "bcryptjs";
import generateJwtToken from "../../../services/generateJwtToken";

// json data --> req.body // username,email,password
// files --> req.file // files
const registerUser = async (req: Request, res: Response) => {
  //    const username = req.body.username
  //    const password = req.body.password
  //    const email = req.body.email
  // incoming data --> accept
  if (req.body == "undefined") {
    res.status(400).json({
      success: false,
      message: "Some data are unsent",
    });
  }
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400).json({
      success: false,
      message: "Please provide username, password, email",
    });
    return;
  }
  const hashedPassword = await bcryptjs.hash(password, 7);

  // insert into Users table
  await User.create({
    username,
    password: hashedPassword,
    email,
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
}; // function
// BOLA Attack

class AuthController {
  static async registerUser(req: Request, res: Response) {
    if (req.body == "undefined") {
      res.status(400).json({
        success: false,
        message: "Some data are unsent",
      });
    }
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      res.status(400).json({
        success: false,
        message: "Please provide username, password, email",
      });
      return;
    }
    const useralreadyExist = await User.findOne({
      where: {
        email,
      },
    });
    if (useralreadyExist) {
      res.status(400).json({
        success: false,
        message: "Users already Exist!!",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 13);
    // insert into Users table
    await User.create({
      username: username,
      password: hashedPassword,
      email: email,
    });
    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  }
  static async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
      return;
    }
    const data = await User.findAll({
      where: {
        email,
      },
    });

    if (data.length == 0) {
      res.status(404).json({
        success: false,
        message: "Not registered!",
      });
      return;
    } else {
      const isPasswordMatch = bcryptjs.compareSync(password, data[0].password);
      if (isPasswordMatch) {
        const token = generateJwtToken({ id: data[0].id });
        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          token,
        });
      } else {
        res.status(401).json({
          message: "Invalid Email and Password!!",
        });
      }
    }
    next();
  }
}

export default AuthController;
