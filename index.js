const express = require('express')
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const {
    ddb
} = require('./db/index')
dotenv.config({
    path: './.env'
})
// public dossier 
const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))
app.use(express.urlencoded({
    extended: false
}))

app.use(express.json())
app.use(cookieParser())
app.set('view engine', 'hbs');

//define routes
// app.use('/generaladmin', require('./routes/admin_genaral/generaladmin'));
// app.use('/centreadmin', require('./routes/centreadmin'));
// app.use('/rayon', require('./routes/rayon'));
app.use('/auth/generaladmin', require('./routes/admin_genaral/generaladmin_auth'));
app.use('/auth/centreadmin', require('./routes/admin_centre/centreadmin_auth'));
app.use('/auth/responsablerayon', require('./routes/rayon/rayon_auth'));
// app.use('/auth', require('./routes/auth'));
// app.use('/auth', require('./routes/auth'));
app.listen(3030, () => {
    console.log("Up Server")
})