import { NextFunction, Request, Response } from "express";
import sequelize from "../../database/dbConfig";
import { generateRandomInstituteNumber } from "../../services/institute.number";
import { IExtendedRequest } from "../../globals";
import User from "../../database/Models/userModel";
import asyncErrorHandler from "../../services/asyncErrorHandling";
import { categoriesData } from "../../seed";

export class InstituteController {
  static async createInstitute(
    req: IExtendedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        instituteName,
        instituteEmail,
        institutePhoneNumber,
        instituteAddress,
      } = req.body;

      ///// vat number and pan number setup
      const instituteVatNo = req.body.instituteVatNo || null;
      const institutePanNo = req.body.institutePanNo || null;

      if (
        !instituteName ||
        !instituteAddress ||
        !instituteEmail ||
        !institutePhoneNumber ||
        (!instituteVatNo && !institutePanNo) // both missing
      ) {
        res.status(400).json({
          success: false,
          message:
            "Please provide all required fields: instituteName, instituteEmail, institutePhoneNumber, instituteAddress, and either instituteVatNo or institutePanNo.",
        });
        return;
      }
      // setup query for the input
      const instituteNumber = generateRandomInstituteNumber();
      await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
id VARCHAR(40) PRIMARY KEY DEFAULT (uuid()),
            instituteName VARCHAR(255) NOT NULL, 
            instituteEmail VARCHAR(255) NOT NULL UNIQUE, 
            institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE, 
            instituteAddress VARCHAR(255) NOT NULL, 
            institutePanNo VARCHAR(255), 
            instituteVatNo VARCHAR(255), 
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`);

      await sequelize.query(
        `INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,institutePhoneNumber,instituteAddress,institutePanNo,instituteVatNo) VALUES(?,?,?,?,?,?)`,
        {
          replacements: [
            instituteName,
            instituteEmail,
            institutePhoneNumber,
            instituteAddress,
            institutePanNo,
            instituteVatNo,
          ],
        },
      );

      //////////////// setting up institute Number
      // if (req.user) {
      //   const user = await User.findByPk(req.user.id);
      //   user?.currentinstituteNumber = instituteNumber;
      //   await user?.save();
      // }

      await User.update(
        {
          currentInstituteNumber: instituteNumber,
          role: "institute",
        },
        {
          where: {
            id: req.user?.id,
          },
        },
      );

      // user ko institue history rakhne table createion
      await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
instituteNumber VARCHAR(200) UNIQUE,
user_id VARCHAR(222) REFERENCES users(id)
)`);

      await sequelize.query(
        `INSERT INTO user_institute(user_id,instituteNumber) VALUES(?,?)`,
        {
          replacements: [req.user?.id, instituteNumber],
        },
      );

      // response setup
      req.instituteNumber = instituteNumber;
      console.log(req.instituteNumber);
      next();
    } catch (err) {
      console.log(err);
    }
  }
}

export const createTeacherTable = asyncErrorHandler(
  async (req: IExtendedRequest, res: Response, next: NextFunction) => {
    try {
      const instituteNumber = req.instituteNumber;
      await sequelize.query(`CREATE TABLE teacher_${req.instituteNumber}(
id VARCHAR(40) PRIMARY KEY DEFAULT (uuid()),
    teacherName VARCHAR(255) NOT NULL, 
    teacherEmail VARCHAR(255) NOT NULL UNIQUE, 
    teacherPhoneNumber VARCHAR(255) NOT NULL ,
    teacherExpertise VARCHAR(100),
    joinedDate DATE,
courseId VARCHAR(38) REFERENCES course_${instituteNumber}(id),
teacherPhoto VARCHAR(255),
teacherPassword VARCHAR(199),
    salary VARCHAR(255),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP            )`);
      next();
    } catch (err) {
      console.log(err);
    }
  },
);

export const createStudentTable = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instituteNumber = req.instituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
id VARCHAR(40) PRIMARY KEY DEFAULT (uuid()),
        studentName VARCHAR(255) NOT NULL, 
        studentPhoneNo VARCHAR(255) NOT NULL UNIQUE,
studnetAddress TEXT ,
enrolledDate DATE,
studentImage VARCHAR(255),
 createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

        )`);
    next();
  } catch (err) {
    console.log(err);
  }
};

export const createCourseTable = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const instituteNumber = req.instituteNumber;
  await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
id VARCHAR(40) PRIMARY KEY DEFAULT (uuid()),
 courseName VARCHAR(255) NOT NULL UNIQUE, 
 coursePrice VARCHAR(255) NOT NULL,
courseDescription TEXT,
courseThubnail VARCHAR(255),
categoryId VARCHAR(40) NOT NULL REFERENCES category_${instituteNumber} (id),
teacherId VARCHAR(255)  NULL REFERENCES teacher_${instituteNumber} (id),
        courseDuration VARCHAR(255) NOT NULL,
        courseLevel ENUM('beginner','intermediate','advanced') NOT NULL,
createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);
  res.status(200).json({
    success: true,
    message: "Institute created Succesfully",
    Id: instituteNumber,
  });
  next();
};

export const createCategoryTable = async (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const instituteNumber = req.instituteNumber;
    await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(

id VARCHAR(40) PRIMARY KEY DEFAULT (uuid()),
categoryName VARCHAR(255) NOT NULL,
categoryDescription TEXT,
createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

)`);

    categoriesData.forEach(async (data) => {
      await sequelize.query(
        `INSERT INTO category_${instituteNumber}(categoryName,categoryDescription) VALUES (?,?)`,
        {
          replacements: [data.categoryName, data.categoryDescription],
        },
      );
    });
    next();
  } catch (err) {
    console.log(err);
  }
};
