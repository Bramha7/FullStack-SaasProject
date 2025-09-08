import { Request, Response, NextFunction, RequestHandler } from "express";

// Define the correct type for the wrapped function
const asyncErrorHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch((err: Error) => {
      res.status(500).json({
        message: err.message,
        fullError: err,
      });
    });
  };
};

export default asyncErrorHandler;
