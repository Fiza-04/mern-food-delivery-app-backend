import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// validates data before getting added to the db
{
  /* all these errors will be passed to the handleValidation                    
function req defined above                                                      
all the errors will then be displayed in an array                               
   */
}
export const validateUserRequest = [
  body("name").isString().notEmpty().withMessage("Enter a valid name"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Enter a valid Address Line 1"),
  body("addressLine2")
    .isString()
    .notEmpty()
    .withMessage("Enter a valid Address Line 2"),
  body("postcode").isString().notEmpty().withMessage("Enter a valid Post Code"),
  body("city").isString().notEmpty().withMessage("Enter a valid City"),
  body("country").isString().notEmpty().withMessage("Enter a valid Country"),
  handleValidation,
];
