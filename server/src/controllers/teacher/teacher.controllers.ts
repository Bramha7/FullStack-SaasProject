// teacher login implementation

import { Request, Response } from "express";
import sequelize from "../../database/dbConfig";
import { QueryTypes } from "sequelize";
import bcrypt from "bcryptjs";
import generateJWTToken from "../../services/generateJwtToken";

interface ITeacherData {
  teacherPassword: string;
  id: string;
}

const teacherLogin = async (req: Request, res: Response) => {
  const { teacherEmail, teacherPassword, teacherInstituteNumber } = req.body;
  if (!teacherEmail || !teacherPassword || !teacherInstituteNumber) {
    res.status(400).json({
      message:
        "Please provide teacherEmail, teacherPassword, teacherInstituteNumber",
    });
    return;
  }
  // query teacher_* whole database vitra query garnu parxa
  const teacherData: ITeacherData[] = await sequelize.query(
    `SELECT * FROM teacher_${teacherInstituteNumber} WHERE teacherEmail = ? `,
    {
      type: QueryTypes.SELECT,
      replacements: [teacherEmail],
    },
  );
  if (teacherData.length == 0) {
    res.status(404).json({
      message: "Invalid credentials",
    });
    return;
  }
  // check password now
  const isPasswordMatched = bcrypt.compareSync(
    teacherPassword,
    teacherData[0].teacherPassword,
  );
  if (!isPasswordMatched) {
    res.status(400).json({
      message: "Invalid credentials!!!!",
    });
  } else {
    // token generation
    const token = generateJWTToken({
      id: teacherData[0].id,
      instituteNumber: teacherInstituteNumber,
    });
    res.status(200).json({
      message: "Teacher logged in",
      token,
    });
  }
};

export { teacherLogin };
