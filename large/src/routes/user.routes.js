import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    // apan ne array islye nahi liya kyuki array ek hi filed mai multiiple value leta hai to apan ko multiple object vaalue cahyie to apn ne fields liya hai
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  registerUser
); // yaha par aaye ga app .use se vo ek middleware hai vo hamashe  hi same hi rahe ga

export default router;
