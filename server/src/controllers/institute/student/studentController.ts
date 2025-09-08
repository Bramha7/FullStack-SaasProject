import { Response } from "express";
import sequelize from "../../../database/dbConfig";
import { IExtendedRequest } from "../../../globals";

const getStudents = async (req: IExtendedRequest, res: Response) => {
  const insituteNumber = req.user?.currentInstituteNumber;
  const students = await sequelize.query(
    `SELECT * FROM student_${insituteNumber}`,
  );
  res.status(200).json({
    messgae: "student fetched",
    data: students,
  });
};

export { getStudents };
