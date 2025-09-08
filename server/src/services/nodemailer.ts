interface IObject {
  from: string;
  to: string;
  subject: string;
  text: string;
}
import nodemailer from "nodemailer";
const sendMail = async (mailObject: IObject) => {
  // core logic to send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailFormatObject = {
    from: mailObject.from,
    to: mailObject.to,
    subject: mailObject.subject,
    text: mailObject.text,
  };
  try {
    await transporter.sendMail(mailFormatObject);
  } catch (err) {
    console.log(err);
  }
};

export default sendMail;
