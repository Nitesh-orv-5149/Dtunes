const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

dotenv.config();
connectDB(); 

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json()); 
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use("/", userRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
