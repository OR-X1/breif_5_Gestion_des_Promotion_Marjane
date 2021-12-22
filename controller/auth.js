const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const {
    promisify
} = require('util')
dotenv.config({
    path: './.env'
})
const {
    db
} = require('../db/index')
exports.register = (req, res) => {
    console.log(req.body)
    const {
        name,
        email,
        password,
        passwordconfirm
    } = req.body
    db.query('SELECT email from users where email = ?', [email], async (err, result) => {
        if (err) {
            console.log(err)
        }

        if (result.length > 0) {
            return res.render('register', {
                message: 'that email is already in use'
            })
        } else if (password !== passwordconfirm) {
            return res.render('register', {
                message: 'password do not match'
            })
        }
        let hashedpassword = await bcrypt.hash(password, 8)
        console.log(hashedpassword)
        db.query('insert into users set ?', {
            name: name,
            email: email,
            password: hashedpassword
        }, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                return res.render('register', {
                    message: 'User registered'
                })
            }
        })
    })
}
exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please add an email and password'
            })
        }
        db.query('select * from users where email = ?', [email], async (err, result) => {
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                return res.status(401).render('login', {
                    message: 'email or password is incorrect'
                })
            } else {
                const id = result[0].id;
                const token = jwt.sign({
                    id
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRE_IN
                })
                console.log("token" + token)
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions)
                res.status(200).redirect("/")
            }
        })
    } catch (error) {
        console.log(error)
    }
}
exports.isLoginIn = async (req, res, next) => {
    console.log(req.cookies)
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
            console.log(decoded)
            db.query('select * from users where id = ?', [decoded.id], (error, result) => {
                console.log(result)
                if (!result) {
                    return next()
                }
                req.user = result[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        next();

    }
}

exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    })
    res.status(200).redirect('/')
}