const express = require("express");
const dotenv = require("dotenv");
const app = express()
const postRouter = require("./routers/posts.js");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('<h1>Benvenuto in express-api-crud, le mie prime API Express!</h1>');
});
app.use("/post", postRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})
