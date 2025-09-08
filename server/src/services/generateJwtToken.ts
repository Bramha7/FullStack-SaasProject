import jwt from "jsonwebtoken";

const generateJWTToken = (data: { id: string; instituteNumber?: string }) => {
  //@ts-ignore
  const token = jwt.sign(data, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
  return token;
};

export default generateJWTToken;
