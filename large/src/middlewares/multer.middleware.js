import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // here the  multer give the  req ke alwa file ka  opton that major  reason to  use multer because the we convert other to json but not a file but ht emulter give the file option already
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // cb => callback
  },
});

export const upload = multer({
  storage,
});
