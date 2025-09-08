import { Request } from "express";
export interface IExtendedRequest extends Request {
  user?: {
    id: string;
    currentInstituteNumber: string;
  };
  instituteNumber?: number;
  teacherpassword?: {
    hashedVersion: string;
    plainVersion: string;
  };
}

/* export interface IInstituteNumber extends Request {
  instituteNumber: string;
} */
