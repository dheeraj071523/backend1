import { Router } from "express";
import {
  loggoutUser,
  loginUser,
  refrehAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  // /regiter  apani taaraf se define hai
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

  registerUser // ye method ka naam hai
); // yaha par aaye ga app .use se vo ek middleware hai vo hamashe  hi same hi rahe ga

router.route("/login").post(loginUser);

// secured routes

router.route("/logout").post(verifyJWT, loggoutUser); // verifyJWT  auth miiddleware ka method hai

router.route("/refresh-token").post(refrehAccessToken);

export default router;
