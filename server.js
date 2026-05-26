const express = require("express");
const testRoutes = require("./routes/test.routes");

const PORT = 5000;
const api = express();

api.use(express.json());
api.use(express.static("public"));

api.use("/test", testRoutes);

api.listen(PORT, ()=>{
    console.log("Server running in http://localhost:5000")
});