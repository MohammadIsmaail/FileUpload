import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import cors from "cors"
const app = express();
app.use(fileUpload());
dotenv.config();
app.use(express.json());
app.use(cors())
// app.use(cors({
//   origin:["",""]
// }))
app.use('/file',express.static("./Upload"))  //   baad main kiya hai


const dbConn = async () => {
  const Conn = await mongoose.connect("mongodb://localhost:27017/FileUpload");
  if (Conn) {
    console.log("DataBase is Connected is Successfully!");
  }
};
dbConn();
const UserDataAgain = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profile: String,
});
const UserModel = mongoose.model("User-Data-Again", UserDataAgain);
app.post("/create", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { profile } = req.files;
    profile.mv("./Upload/" + profile?.name, async (err) => {
      if (err) {
        console.log(err);
      }
      const data = new UserModel({
        name,
        email,
        password,
        profile: profile.name,
      });
      const result = await data.save();
      res.json({
        success: true,
        code: 200,
        message: "User Created",
        data: result,
        error: false,
      });
    });
    // res.send({name,email,password,profile})
    // res.json({name,email,password,profile})
  } catch (err) {
    console.log(err);
  }
});


app.get("/file-data",async(req,res)=>{
  // const {name,email,password,profile} = req.body
  const result = await UserModel.find().sort({email:1})
  res.json({
    data:result
  })
})


const Port = process.env.PORT || 9000;
app.listen(Port, () => {
  console.log(`Server is running on ${Port}`);
});
