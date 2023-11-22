require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const alphabetRoutes = require("./routes/alphabetRoutes");
const gradesRoutes = require("./routes/gradesRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/alphabet", alphabetRoutes);
// app.use("/api/grades");

mongoose.set({ strictQuery: true });
mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(
            process.env.PORT || 3000,
            console.log("Now connected to MongoDB Atlas"),
            console.log(`Server is running at port ${process.env.PORT || 3000}`)
        );
    })
    .catch((err) => {
        console.log(err);
    });
