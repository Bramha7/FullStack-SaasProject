import bcrypt from "bcryptjs";
export const generateRandomPassword = (teacherName: string) => {
  const randomNumber = Math.floor(1000 + Math.random() * 90000);
  const passwordData = {
    hashedVersion: bcrypt.hashSync(`${randomNumber}_${teacherName}`, 11),
    plainVersion: `${randomNumber}_${teacherName}`,
  };
  return passwordData;
};
