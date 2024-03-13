import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
//import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use(cookieparser());

// routes  import
import userRouter from "./routes/user.routes.js";

//routes declaration

app.use("/api/v1/users", userRouter); //standard practice   // http://localhost:3000/api/v1/users/register // move the user router file // ye ek middleware hai ye hamase hi same hi rahe ga

export { app };
