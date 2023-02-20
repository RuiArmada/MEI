const { User } = require('../model/db/model.db')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require("jsonwebtoken")

const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu"

exports.validateJWT = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ')
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send()
            } else {
                req.jwt = jsonwebtoken.verify(authorization[1], JWT_SECRET)
                console.log(Date.now() - req.jwt.lastOnline >= 18000000)
                if(Date.now() - req.jwt.lastOnline >= 18000000)
                    return res.status(401).send()
                return next()
            }
        } catch (err) {
            console.log(err)
            return res.status(403).send()
        }
    } else {
        return res.status(401).send()
    }
}

exports.validateToken = async (req, res) => {
    const userData = req.jwt
    console.log(userData)
    return res.status(200).json(userData)
}

exports.login = async (req, res) => {
    const data = req.body
    const { email, password } = data

    const user = await User.findOne({
        where: {
            email: email,
        }
    })

    if(user && bcrypt.compareSync(password, user.dataValues.password)) {
        const userData = { ...user.dataValues }
        delete userData.password

        return res
            .status(200)
            .json({
                status: true,
                token: jsonwebtoken.sign({
                    ...userData,
                    lastLogin: Date.now()
                }, JWT_SECRET),
                user: userData,
            })
    }

    return res
        .status(200)
        .json({
            status: false,
            message: "The username and password your provided are invalid"
        })
}

exports.register = async (req, res) => {
    const { userData } = req.body
    console.log(userData)

    if(userData.password.trim() !== userData.confPassword.trim())
        return res
            .status(400)
            .json({ message: "The passwords don't match" })

    delete userData.confPassword

    const newUserData = {
        ...userData,
        wallet: 0.0,
        password: bcrypt.hashSync(userData.password, 10),
        birthday: new Date(parseInt(userData.birthday)), // Should receive a timestamp
    }
    await User.create(newUserData)

    return res
        .status(200)
        .json({
            status: true,
            message: "User registered successfully."
        })
}

exports.getAge = async (req, res) => {
    var today = new Date();
    var birthDate = new Date(req);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    // return age;
    return res
           .status(200)
           .send(age)
  }