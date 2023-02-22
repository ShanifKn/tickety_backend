import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import multer from "multer";
import * as dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const storage = multerS3({
  s3: s3Client,
  bucket: process.env.BUCKET_NAME,
  key: function (req, file, cb) {
    cb(null, Date.now().toString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
