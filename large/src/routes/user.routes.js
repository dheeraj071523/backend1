import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

const router = Router();

router.route("/register").post(registerUser); // yaha par aaye ga app .use se vo ek middleware hai vo hamashe  hi same hi rahe ga

export default router;
