const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");

const cors = require("cors");
require("dotenv/config");

//Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use("/posts", postsRoute);
app.use("/users", usersRoute);

app.use(express.json());

app.post("/", (req, res) => {
  res.send("Welcome to RestApi App");
});
//Connecting to MongoDB
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 4000);
