import { Table, Column, DataType, Model } from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
class User extends Model {
  // username
  @Column({
    type: DataType.STRING,
  })
  declare username: string;

  // password
  @Column({
    type: DataType.STRING,
  })
  declare password: string;
  // email

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;
  // id

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM("teacher", "student", "institute", "super-admin"),
    defaultValue: "student",
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
  })
  declare currentInstituteNumber: string;
}

export default User;
