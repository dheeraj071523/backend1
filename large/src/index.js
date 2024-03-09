//require("dotenv").config({ path: "./env" });

import coonectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });

coonectDB();

// import express from "express";

// const app = express();

// async () => {
//   try {
//     const inatnce = await mongoose.connect(
//       `${process.env.MONGODB_URL}/${DB_NAME}`
//     );
//     console.log(inatnce);

//     app.on("error", (error) => {
//       console.error("ERROR: ", error);
//       throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`app is listening form the PORT ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.error("ERROR: ", error);
//     throw error;
//   }
// };
