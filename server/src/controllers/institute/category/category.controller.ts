import { Response } from "express";
import { IExtendedRequest } from "../../../globals";
import sequelize from "../../../database/dbConfig";
import { QueryTypes } from "sequelize";

interface ICategoryData {
  id: string;
  createdAt: Date;
}

const createCategory = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.currentInstituteNumber;
  const { categoryName, categoryDescription } = req.body;
  if (!categoryDescription || !categoryName) {
    res.status(400).json({
      success: false,
      message: "Provide both categoryName and categoryDescription",
    });
    return;
  }
  await sequelize.query(
    `INSERT INTO category_${instituteNumber}(categoryName,categoryDescription) VALUES (
?,?
)`,
    {
      replacements: [categoryName, categoryDescription],
      type: QueryTypes.INSERT,
    },
  );
  const [categorydata]: ICategoryData[] = await sequelize.query(
    `SELECT id ,createdAt from category_${instituteNumber} WHERE categoryName=?`,
    {
      replacements: [categoryName],
      type: QueryTypes.SELECT,
    },
  );

  res.status(201).json({
    success: true,
    message: "Course Category Created successfully",
    data: {
      categoryName,
      categoryDescription,
      id: categorydata.id,
      createdAt: categorydata.createdAt,
    },
  });
};

const getCategory = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.currentInstituteNumber;
  if (instituteNumber == undefined) {
    res.status(200).json({
      message: "Login and create institute!!",
    });
    return;
  }

  const categories = await sequelize.query(
    `SELECT * FROM category_${instituteNumber}`,
    {
      type: QueryTypes.SELECT,
    },
  );
  res.status(200).json({
    success: true,
    data: categories,
  });
};
const deleteCategory = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.currentInstituteNumber;
  const id = req.params.id;

  await sequelize.query(
    `DELETE FROM category_${instituteNumber} WHERE id = ?`,
    {
      type: QueryTypes.DELETE,
      replacements: [id],
    },
  );
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};

export { createCategory, getCategory, deleteCategory };
