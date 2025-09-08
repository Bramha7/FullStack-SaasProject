import { Request, Response } from "express";
import { IExtendedRequest } from "../../../globals";
import sequelize from "../../../database/dbConfig";
import User from "../../../database/Models/userModel";
import { QueryTypes } from "sequelize";

// CREATE COURSE
export const createCourse = async (req: IExtendedRequest, res: Response) => {
  let userValidation;
  try {
    [userValidation] = await User.findAll({
      where: {
        id: req.user?.id,
      },
    });
    if (userValidation.role != "institute") {
      res.status(403).json({
        success: false,
        message: "Signup for institute",
      });
      return;
    }
    let {
      courseName,
      coursePrice,
      courseDuration,
      courseLevel,
      courseDescription,
      courseThubnail,
      categoryId,
      teacherId,
    } = req.body;
    // setting up categoryId in req

    if (
      !courseName ||
      !coursePrice ||
      !courseDuration ||
      !courseLevel ||
      !courseDescription ||
      !categoryId
    ) {
      res.status(400).json({
        success: false,
        message:
          "Please provide courseName, courseDescription, courseLevel, coursePrice, and courseDuration.categoryId",
      });
      return;
    }
    courseThubnail = req.file?.path || null;

    await sequelize.query(
      `INSERT INTO course_${req.user?.currentInstituteNumber} 
        (courseName, courseDescription, coursePrice, courseLevel, courseDuration, courseThubnail,categoryId) 
        VALUES (?, ?, ?, ?, ?, ?,?)`,
      {
        type: QueryTypes.INSERT,
        replacements: [
          courseName,
          courseDescription,
          coursePrice,
          courseLevel,
          courseDuration,
          courseThubnail,
          categoryId,
        ],
      },
    );

    res.status(200).json({
      success: true,
      message: "Course created successfully.",
      courseNumber: req.user?.currentInstituteNumber,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// DELETE COURSE
export const deleteCourse = async (req: IExtendedRequest, res: Response) => {
  try {
    const instituteNumber = req.user?.currentInstituteNumber;
    const courseId = req.params.id;

    const [courseData]: any = await sequelize.query(
      `SELECT * FROM course_${instituteNumber} WHERE id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [courseId],
      },
    );

    if (!courseData || courseData.length === 0) {
      res.status(404).json({
        success: false,
        message: "Course not found.",
      });
      return;
    }

    await sequelize.query(
      `DELETE FROM course_${instituteNumber} WHERE id = ?`,
      {
        type: QueryTypes.DELETE,
        replacements: [courseId],
      },
    );

    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET ALL COURSES
export const getAllCourse = async (req: IExtendedRequest, res: Response) => {
  try {
    const instituteNumber = req.user?.currentInstituteNumber;
    const [courses]: any = await sequelize.query(
      `SELECT * FROM course_${instituteNumber} JOIN category_${instituteNumber} on category_${instituteNumber}.id=course_${instituteNumber}`,
      {
        type: QueryTypes.SELECT,
      },
    );

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully.",
      data: courses,
    });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET SINGLE COURSE
export const getSingleCourse = async (req: IExtendedRequest, res: Response) => {
  try {
    const instituteNumber = req.user?.currentInstituteNumber;
    const courseId = req.params.id;

    const [singleCourse]: any = await sequelize.query(
      `SELECT * FROM course_${instituteNumber} WHERE id = ?`,
      {
        type: QueryTypes.SELECT,
        replacements: [courseId],
      },
    );

    if (!singleCourse || singleCourse.length === 0) {
      res.status(404).json({
        success: false,
        message: "Course not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Single course fetched successfully.",
      data: singleCourse[0],
    });
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
