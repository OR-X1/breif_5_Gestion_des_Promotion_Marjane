const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
    db
} = require('../../db/index')
////////////////////
exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        console.log(req.body)
        if (!email || !password) {
            return res.status(401).send({
                msg: "Please add an email and password"
            })
        }
        db.query('select * from admin_genirale where email = ?', [email], async (err, result) => {
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                return res.status(401).send({
                    message: 'email or password is incorrect'
                })
            } else {
                const id = result[0].id;
                const token = jwt.sign({
                    id
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRE_IN
                })
                // const cookieOptions = {
                //     expires: new Date(
                //         Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
                //     ),
                //     httpOnly: true
                // }
                return res.status(200).send({
                    msg: "lOGIN SUCCES",
                    token: token
                })
            }
        })
    } catch (error) {
        console.log(error)
    }
}
exports.isLoginIn = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.userData = decoded;
        return next()
    } catch (err) {
        return res.status(401).send({
            msg: 'Your session is not valid!'
        });
    }
}
exports.creation = (req, res) => {
    const {
        name,
        prenom,
        email,
        password,
        passwordconfirm,
        centreid
    } = req.body
    db.query('SELECT email from admin_center where email = ?', [email], async (err, result) => {
        if (err) {
            console.log(err)
        }

        if (result.length > 0) {
            return res.status(401).send({
                msg: "email as ready used"
            })
        } else if (password !== passwordconfirm) {
            return res.status(401).send({
                msg: "Password do not match"
            })
        }
        let hashedpassword = await bcrypt.hash(password, 8)
        console.log(hashedpassword)
        db.query('insert into admin_center set ?', {
            nom: name,
            prenom: prenom,
            email: email,
            password: hashedpassword,
            center_id: centreid
        }, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                return res.status(200).send({
                    msg: "Add admin center"
                })
            }
        })
    })
}
exports.creationcentre = (req, res) => {
    const {
        name,
    } = req.body
    db.query('SELECT name from center where name = ?', [name], async (err, result) => {
        if (err) {
            console.log(err)
        }
        if (result.length > 0) {
            return res.status(401).send({
                msg: "name already used"
            })
        }
        db.query('insert into center set ?', {
            name: name,
        }, (err, result) => {
            if (err) {
                return res.status(401).send({
                    msg: err
                })
            } else {
                return res.status(200).send({
                    msg: "Center Created"
                })
            }
        })
    })
}
exports.update = (req, res) => {

    const {
        name,
        prenom,
        email,
    } = req.body
    const {
        id,
    } = req.params
    db.query('update admin_center set nom = ?,prenom= ?,email= ? where id=?', [name, prenom, email, id], (err, result) => {
        if (err) {
            return res.status(401).send({
                msg: err
            })
        } else {
            return res.status(200).send({
                msg: "Update admin center"
            })
        }
    })
}
exports.delete = (req, res) => {
    const {
        id,
    } = req.params
    db.query('delete from admin_center where id=?', id, (err, result) => {
        if (err) {
            return res.status(401).send({
                msg: err
            })
        } else {
            return res.status(200).send({
                msg: "admin center delete"
            })
        }
    })

}
exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    })
    return res.status(200).send({
        msg: "Logout"
    })
}