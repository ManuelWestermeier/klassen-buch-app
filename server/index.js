import express from "express"
import cors from "cors"
import crypto from 'crypto'

const app = express()

//admin1234
const adminPasswordHash = "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270";

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

const isAdmin = (req, res) => {
    const hashedPassword = hashPassword(req.query.password);

    if (hashedPassword == adminPasswordHash) {
        return true
    }

    res.json("not auth")

    return false
};

app.use(cors({
    origin: "*"
}))

const absentList = []

const classes = {
    "10a": {
        password: "dhajw2",
        students: [],
    },
    "10b": {
        password: "sjh22q",
        students: [],
    },
    "10c": {
        password: "sh2ush",
        students: [],
    },
    "11a": {
        password: "kssns2",
        students: [],
    },
    "11b": {
        password: "287shh",
        students: [],
    },
    "11c": {
        password: "qwmne2",
        students: [],
    }
}

app.get("/classes/", (req, res) => res.json(Object.keys(classes)))

app.get("/auth-class/", (req, res) => {
    const isAuth = classes[req.query?.class + ""]?.password == req.query?.password + ""
    res.json(isAuth)
})

app.get("/class/students/", (req, res) => {
    const isAuth = classes[req.query?.class + ""]?.password == req.query?.password + ""

    if (!isAuth) {
        return res.json("not auth")
    }

    res.json(classes[req.query.class].students)
})

app.get("/admin/absent/", (req, res) => {
    if (!isAdmin(req, res)) return
    res.json(absentList)
})

app.listen(8080)