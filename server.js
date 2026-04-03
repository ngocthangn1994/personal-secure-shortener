const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/ds");

const app = express();
connectDB();

const linkRoutes = require("./routes/linkRoutes");
const { redirectToLongUrl } = require("./controllers/linkController");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/index.html");
});

app.use("/api/links", linkRoutes);
app.get("/:short", redirectToLongUrl);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});