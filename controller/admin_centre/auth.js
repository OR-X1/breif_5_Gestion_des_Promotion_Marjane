const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
    db
} = require('../../db/index')


const emailsend = require('../email')
const logs = require('../log')



////////////////////
exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        console.log(req.body)
        if (!email || !password) {
            return res.status(200).send({
                msg: "Please add an email and password"
            })
        }
        db.query('select * from admin_center where email = ?', [email], async (err, result) => {
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                return res.status(200).send({
                    err: 'email or password is incorrect'
                })
            } else {
                const id = "admin_center";
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
                    data: result,
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
        if (decoded.id == "admin_center") {
            return next()

        } else {
            return res.status(401).send({
                msg: 'You dont have a permission'
            });
        }
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
        category
    } = req.body
    db.query('SELECT email from responsable_rayon where email = ?', [email], async (err, result) => {
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
        db.query('insert into responsable_rayon set ?', {
            nom: name,
            prenom: prenom,
            email: email,
            password: hashedpassword,
            category: category
        }, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                return res.status(200).send({
                    msg: "Add rayon responsable"
                })
            }
        })
    })
    let subj = "Your Login Info";
    let msg = ` email : ${email}
                password : ${password}
        `;
    emailsend.mail(email, subj, msg)

}

exports.getall = (req, res) => {

    db.query('SELECT * FROM `responsable_rayon`',  (err, getallresponsablerayon) => {
        if (err) {
            console.log(err)
        }
        if (getallresponsablerayon.length > 0) {
            return res.status(200).json({
                msg: "fetch all data",
                getallresponsablerayon
            })
        }
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
    db.query('update responsable_rayon set nom = ?,prenom= ?,email= ? where id=?', [name, prenom, email, id], (err, result) => {
        if (err) {
            return res.status(401).send({
                msg: err
            })
        } else {
            return res.status(200).send({
                msg: "Update rayon responsable"
            })
        }
    })
}
exports.delete = (req, res) => {
    const {
        id,
    } = req.params
    db.query('delete from responsable_rayon where id=?', id, (err, result) => {
        if (err) {
            return res.status(401).send({
                msg: err
            })
        } else {
            return res.status(200).send({
                msg: "rayojn responsable delete"
            })
        }
    })

}

// exports.getallpromotion = (req, res) => {

//     db.query('SELECT produit.name, produit.prix, produit.quantite, produit.category, promotion.porcentage, p_p.status ,p_p.commentaire FROM p_p, produit, promotion where p_p.produit_id = produit.id and p_p.promotion_id = promotion.id;',  (err, getallpromotion) => {
//         if (err) {
//             console.log(err)
//         }
//         if (getallpromotion.length > 0) {
//             return res.status(200).json({
//                 msg: "fetch all data",
//                 getallpromotion
//             })
//         }
//     })
// }

exports.getallpromotion = (req, res) => {

    db.query('SELECT produit.name, produit.prix, produit.quantite, produit.category, promotion.porcentage, p_p.status ,p_p.commentaire FROM p_p, produit, promotion where p_p.produit_id = produit.id and p_p.promotion_id = promotion.id',  (err, getallpromotion) => {
        if (err) {
            console.log(err)
        }
        var getalladmincenter = getalladmincenter;
        db.query('SELECT * FROM `produit`',  (err, getallproduct) => {
            if (err) {
                console.log(err)
            }
            if (getallpromotion.length > 0) {
                return res.status(200).json({
                    msg: "fetch all data",
                    getallpromotion,
                    getallproduct
                })
            }
        })
    })
}



exports.creationpromotion = (req, res) => {
    const {
        porcentage,
        produit_id
    } = req.body
    db.query('insert into promotion set ?', {
        porcentage: porcentage,
        point_fidelite: porcentage * 10
    }, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result.insertId)
            db.query('insert into p_p set ?', {
                produit_id: produit_id,
                promotion_id: result.insertId
            }, (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)

                    return res.status(200).send({
                        msg: "Add promotion with success"
                    })
                }
            })
        }
    })
}



exports.getvalidepromo = (req, res) => {
    db.query('SELECT produit.name, produit.prix, produit.quantite, promotion.porcentage, p_p.status ,p_p.commentaire FROM p_p, produit, promotion where p_p.produit_id = produit.id and p_p.promotion_id = promotion.id and p_p.status="1"', (err, result) => {
        if (err) {
            let msg = "admincentre try to get validpromo"
            logs.insertlog(msg);
            console.log(err);
            return;
        } else {
            let msg = "admincentre get validpromo"
            logs.insertlog(msg);
            return res.json({
                succes: true,
                msg: "valide promo",
                data: result
            })
        }
    })
}
exports.getinvalidepromo = (req, res) => {
    db.query('SELECT produit.name, produit.prix, produit.quantite, promotion.porcentage, p_p.status ,p_p.commentaire FROM p_p, produit, promotion where p_p.produit_id = produit.id and p_p.promotion_id = promotion.id and p_p.status="0"', (err, result) => {
        if (err) {
            let msg = "admincentre try to get invalidpromo"
            logs.insertlog(msg);
            console.log(err);
            return;
        } else {
            let msg = "admincentre get invalidpromo"
            logs.insertlog(msg);
            return res.json({
                succes: true,
                msg: "invalide promo",
                data: result
            })
        }
    })
}
exports.promopasencore = (req, res) => {
    db.query('SELECT produit.name, produit.prix, produit.quantite, promotion.porcentage, p_p.status FROM p_p, produit, promotion where p_p.produit_id = produit.id and p_p.promotion_id = promotion.id and p_p.status IS Null', (err, result) => {
        if (err) {
            let msg = "admincentre try to get pas encore promo"
            logs.insertlog(msg);
            console.log(err);
            return;
        } else {
            let msg = "admincentre get pas encore promo"
            logs.insertlog(msg);
            return res.json({
                succes: true,
                msg: "invalide promo",
                data: result
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