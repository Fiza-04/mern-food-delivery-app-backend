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

export const validateRestaurantRequest = [
  body("restaurantName")
    .isString()
    .notEmpty()
    .withMessage("Enter a restaurant name"),
  body("restaurantAddress")
    .isString()
    .notEmpty()
    .withMessage("Enter a restaurant address"),
  body("restaurantPinCode")
    .isString()
    .notEmpty()
    .withMessage("Enter a restaurant pin code"),
  body("restaurantCity")
    .isString()
    .notEmpty()
    .withMessage("Enter a restaurant city"),
  body("restaurantCountry")
    .isString()
    .notEmpty()
    .withMessage("Enter a restaurant country"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .notEmpty()
    .withMessage("Enter a valid delivery price"),
  body("estimatedDeliveryTimeFrom")
    .isFloat({ min: 0 })
    .notEmpty()
    .withMessage("Enter a valid delivery time min"),
  body("estimatedDeliveryTimeTo")
    .isFloat({ min: 0 })
    .notEmpty()
    .withMessage("Enter a valid delivery time max"),
  body("cuisines")
    .isArray()
    .not()
    .isEmpty()
    .withMessage("Cuisines cannot be empty"),
  body("menuItems").isArray().withMessage("Menu items must be present"),
  body("menuItems.*.itemName")
    .notEmpty()
    .withMessage("Enter valid menu item's name"),
  body("menuItems.*.itemDescription")
    .notEmpty()
    .withMessage("Enter valid menu item's description"),
  body("menuItems.*.itemPrice")
    .isFloat({ min: 0 })
    .withMessage("Enter valid price"),
  handleValidation,
];
