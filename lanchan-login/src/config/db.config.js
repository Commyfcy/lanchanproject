const { Password, Pool } = require("@mui/icons-material");

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root1999",
    DB: "nodejs_image_upload",
    dialect: "mysql",
    pool: {
        max: 5 ,
        min: 0 ,
        acqiure :30000,
        idle: 10000
    }
}