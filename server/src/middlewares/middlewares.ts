import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../database/Models/userModel";
import { IExtendedRequest } from "../globals";

async function isLoggedIn(
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "You are not logged in!",
    });
    return;
  }
  /// verify whether it is encoded with our secret token or not

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (err, decoded: any) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: "Invalid token",
        });
        return;
      }

      // Optionally attach user info to the request object
      // /////////////////// one method
      const userData = await User.findByPk(decoded.id, {
        attributes: ["id", "currentInstituteNumber"],
      });

      if (!userData) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }
      console.log("Successfully verified user:");

      /* const userData = await User.findAll({
          where: {
            id: decoded.id,
          },
        });
        if (userData.length === 0) {
          res.status(404).json({
            success: false,
            message: "User not found",
          });
          return;
        } else {
          console.log("Successfully verified");
        } */
      req.user = userData;

      next();
    },
  );
}

// class Middleware {
//   static async isLoggedIn(req: Request, res: Response, next: NextFunction) {
//     const token = req.headers.authorization;
//
//     if (!token) {
//       res.status(401).json({
//         success: false,
//         message: "You are not logged in!",
//       });
//       return;
//     }
//     /// verify whether it is encoded with our secret token or not
//
//     jwt.verify(
//       token,
//       process.env.JWT_SECRET as string,
//       async (err, decoded: any) => {
//         if (err) {
//           res.status(403).json({
//             success: false,
//             message: "Invalid token",
//           });
//           return;
//         }
//         console.log(decoded);
//
//         // Optionally attach user info to the request object
//         // /////////////////// one method
//         const userData = await User.findByPk(decoded.id);
//
//         if (!userData) {
//           res.status(404).json({
//             success: false,
//             message: "User not found",
//           });
//           return;
//         }
//         console.log("Successfully verified user:");
//
//         /* const userData = await User.findAll({
//           where: {
//             id: decoded.id,
//           },
//         });
//         if (userData.length === 0) {
//           res.status(404).json({
//             success: false,
//             message: "User not found",
//           });
//           return;
//         } else {
//           console.log("Successfully verified");
//         } */
//
//         next();
//       },
//     );
//   }
// }

export default isLoggedIn;
