import {NextFunction, Request, Response} from "express";
import {InsufficientScopeError, InvalidTokenError, UnauthorizedError,} from "express-oauth2-jwt-bearer";
import {MulterError} from "multer";

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error instanceof InsufficientScopeError) {
    const message = "Permission denied";

    response.status(error.status).json({message});

    return;
  }

  if (error instanceof InvalidTokenError) {
    const message = "Bad credentials";

    response.status(error.status).json({message});

    return;
  }

  if (error instanceof UnauthorizedError) {
    const message = "Requires authentication";

    response.status(error.status).json({message});

    return;
  }

  if (error instanceof MulterError && error.code === "LIMIT_FILE_SIZE") {
    const message = "File too large";

    response.status(400).json({message});

    return;
  }

  if (error instanceof MulterError && error.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Unexpected field";

    response.status(400).json({message});

    return;
  }

  const status = 500;
  const message = "Internal Server Error";

  response.status(status).json({message});
};
