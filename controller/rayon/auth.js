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
        if (!email || !password) {
            return res.status(200).send({
                msg: "Please add an email and password"
            })
        }
        db.query('select * from responsable_rayon where email = ?', [email], async (err, result) => {
            if (!result || !(await bcrypt.compare(password, result[0].password))) {
                return res.status(200).send({
                    message: 'email or password is incorrect'
                })
            } else {
                const id = "responsable_rayon";
                console.log(id);
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
        if (decoded.id == "responsable_rayon") {
            return next()

        } else {
            return res.status(200).send({
                msg: 'You dont have a permission'
            });
        }
    } catch (err) {
        return res.status(200).send({
            msg: 'Your session is not valid!'
        });
    }
}

exports.update = (req, res) => {

    const {
        status,
        commentaire
    } = req.body
    const {
        id,
    } = req.params
    console.log(id);

    db.query('SELECT produit.prix, promotion.porcentage FROM p_p, produit, promotion where p_p.produit_id = produit.id and p_p.promotion_id = promotion.id and p_p.id = ?;', [id], (err, result) => {
        if (err) {
            return res.status(401).send({
                msg: err
            })
        } else {
            //  res.status(200).send({
            const data_promotion = result[0].prix - (result[0].porcentage * result[0].prix / 100)
            // })

            db.query('update p_p set status = ?,commentaire= ? where id=?', [status, commentaire, id], (err, result) => {
                if (err) {
                    return res.status(401).json({
                        msg: err
                    })
                } else {

                    db.query('UPDATE `produit` SET `prix_promotion` = ? WHERE `produit`.`id` = ?;', [data_promotion, id], (err, result) => {
                        if (err) {
                            return res.status(401).json({
                                msg: err
                            })
                        } else {
                            return res.status(200).json({
                                msg: "status & comment is done"
                            })
                        }
                    })
                }
            })
        }
    })

}
exports.getpromo = (req, res) => {

    const {
        category,
    } = req.params

    const date = new Date();
    const currentHour = date.getHours();
    // if ((8 < currentHour) && (currentHour < 12)) {

        db.query('SELECT  produit.name, produit.prix, produit.quantite, produit.category, promotion.porcentage, p_p.id, p_p.status FROM p_p, produit, promotion where p_p.produit_id = produit.id and p_p.promotion_id = promotion.id and produit.category = "'+category+'"', (err, result) => {
            if (err) {
                console.log(err);
                return;
            } else {
                return res.json({
                    succes: true,
                    data: result
                })
            }
        })
    // } else {

    //     return res.json({
    //         succes: false,
    //         data: "there's no promotions right now, get back later"
    //     })
    // }


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