import { Sequelize } from "sequelize-typescript";

import "dotenv/config";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  models: [__dirname + "/Models"],
});

sequelize.authenticate().then(() => console.log("Authenticated"));

sequelize
  .sync({ alter: false })
  .then(() => console.log("syncronization successful"));

export default sequelize;
