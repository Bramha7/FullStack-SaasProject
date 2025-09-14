import { Response } from "express";
import { IExtendedRequest } from "../../../globals";
import sequelize from "../../../database/dbConfig";
import { QueryTypes } from "sequelize";
import { generateRandomPassword } from "../../../services/generateRandomPassword";
import sendMail from "../../../services/nodemailer";

interface ITeacherPassword {
  id: string;
  teacherName: string;
  teacherEmail: string;
  createdAt: string;
}

export const createTeacher = async (req: IExtendedRequest, res: Response) => {
  try {
    const instituteNumber = req.user?.currentInstituteNumber;
    if (instituteNumber == undefined || null) {
      res.status(400).json({
        message: "Institutenumber is null or undefined",
      });
      return;
    }

    if (req.body == undefined) {
      res.status(400).json({
        success: false,
        message:
          "All fields are required: teacherName,  teacherEmail, teacherPhoneNumber,teacherExpertise, teacherJoinedDate,teacherSalary,courseId,",
      });
      return;
    }

    const {
      teacherName,
      teacherEmail,
      teacherPhoneNumber,
      teacherExpertise,
      teacherJoinedDate,
      teacherSalary,
      courseId,
    } = req.body;
    const teacherPhoto = req.file ? req.file.path : null;
    if (
      !teacherName ||
      !teacherEmail ||
      !teacherPhoneNumber ||
      !teacherExpertise ||
      !teacherJoinedDate ||
      !teacherSalary ||
      !courseId
    ) {
      res.status(400).json({
        success: false,
        message:
          "Please provide teacherName teacherEmail ,teacherJoinedDate, teacherPhoneNumber, teacherExpertise , teacherSalary, courseId where teacherPhoto is optional",
      });
      return;
    }

    const data = generateRandomPassword(teacherName);
    req.teacherpassword = data;
    await sequelize.query(
      `INSERT INTO teacher_${instituteNumber}(
teacherName,
teacherEmail,
teacherPhoneNumber,
teacherExpertise,
joinedDate,
teacherPhoto,
salary,
teacherPassword,
courseId
) VALUES (?,?,?,?,?,?,?,?,?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          teacherName,
          teacherEmail,
          teacherPhoneNumber,
          teacherExpertise,
          teacherJoinedDate,
          teacherPhoto,
          teacherSalary,
          data.hashedVersion,
          courseId,
        ],
      },
    );
    await sequelize.query(
      `UPDATE course_${instituteNumber}
   SET teacherId = (
     SELECT id FROM teacher_${instituteNumber}
     ORDER BY id ASC
     LIMIT 1
   )
   WHERE teacherId IS NULL`,
      {
        type: QueryTypes.UPDATE,
      },
    );

    const mailSetup = {
      from: `send Mail <${process.env.NODEMAILER_USERNAME}>`,
      to: teacherEmail,
      subject: `Welcome ${teacherName} to Our institution!!`,
      text: `Thanks for choosing us as a <h1 style="color: gray">institution</h1>. We are really graceful to accept you as a active member of our institution. To all memeber we provide authentication credential to manage their account and privileges. Your username is ${teacherEmail} and Password is ${data.plainVersion} and institution Number ${instituteNumber}`,
    };
    // Get the inserted teacher ID
    const [insertedTeacher] = await sequelize.query<ITeacherPassword>(
      `SELECT id,teacherEmail FROM teacher_${instituteNumber} ORDER BY id DESC LIMIT 1`,
      { type: QueryTypes.SELECT },
    );
    console.log(insertedTeacher);

    // Save plain password in admin table
    await sequelize.query(
      `INSERT INTO teacher_password_admin(teacherId, plainPassword, teacherEmail) VALUES (?, ?,?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          insertedTeacher.id,
          data.plainVersion,
          insertedTeacher.teacherEmail,
        ],
      },
    );

    // nodemailer setup
    await sendMail(mailSetup);
    res.status(201).json({
      success: true,
      message: "Teacher's data inserted successfully!!",
      instituteNumber,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getTeacher = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.currentInstituteNumber;
  if (instituteNumber == null || undefined) {
    res.status(400).json({
      message: "Number is missing",
    });
    return;
  }
  const teachers = await sequelize.query(
    `SELECT * from teacher_${instituteNumber}`,
    {
      type: QueryTypes.SELECT,
    },
  );

  res.status(200).json({
    success: true,
    message: "fetched successfully !!",
    data: teachers,
  });
};

export const getTeacherPasswords = async (
  req: IExtendedRequest,
  res: Response,
) => {
  try {
    const instituteNumber = req.user?.currentInstituteNumber;
    if (!instituteNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Institute number missing" });
    }

    // Fetch teacher passwords for admin dashboard
    const teacherPasswords: ITeacherPassword[] =
      await sequelize.query<ITeacherPassword>(
        `SELECT t.id as teacherId, p.plainPassword,t.teacherEmail,p.createdAt
       FROM teacher_${instituteNumber} t
       JOIN teacher_password_admin p ON t.id = p.teacherId`,
        {
          type: QueryTypes.SELECT,
        },
      );

    return res.status(200).json({
      success: true,
      message: "Teacher passwords fetched successfully",
      data: teacherPasswords,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching teacher passwords",
    });
  }
};
export const deleteTeacher = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.currentInstituteNumber;
  const id = req.params.id;
  await sequelize.query(`DELETE FROM teacher_${instituteNumber} WHERE id=?`, {
    type: QueryTypes.DELETE,
    replacements: [id],
  });
  res.status(200).json({
    message: "delete Teacher successfully",
  });
};
