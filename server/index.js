import express from "express";
import cors from "cors";
import crypto from 'crypto';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow all CORS requests
app.use(cors({
    origin: "*"
}));

// Predefined admin password hash
// Password: admin1234
const adminPasswordHash = "ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270";

// Function to hash a password
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    const hashedPassword = hashPassword(req.query.password);

    if (hashedPassword === adminPasswordHash) {
        return next();
    }

    res.status(401).json("not auth");
};

const isClient = (req, res, next) => {

    const isAuth = classes[req.query.class]?.password === req.query.password;

    if (!isAuth || !req.query.class || !req.query.password) {

        const hashedPassword = hashPassword(req.query.password);

        if (hashedPassword === adminPasswordHash) {
            return next();
        }

        return res.json("not auth")
    }

    next()
}

// Mock classes data
const classes = {
    "10a": {
        password: "dhajw2",
        students: [["hans xy", [new Date().toDateString()]], ["Henrik Killman", []]],
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
};

// Route to get all classes
app.get("/classes/", (req, res) => res.json(Object.keys(classes)));

// Route to authenticate class access
app.get("/auth-class/", (req, res) => {
    const isAuth = classes[req.query.class]?.password === req.query.password;
    if (!isAuth || !req.query.class || !req.query.password) {
        return res.json(false)
    }
    res.json(isAuth);
});

// Route to get students of a class
app.get("/class/students/", isClient, (req, res) => {
    const isAuth = classes[req.query.class]?.password === req.query.password;

    if (!isAuth || !req.query.class || !req.query.password) {
        return res.status(401).json("not auth");
    }

    res.json(classes[req.query.class].students);
});

// Route to get absent students of a class
app.get("/class/students/absent/", isClient, (req, res) => {
    const today = new Date().toDateString();

    const absentStudents = classes[req.query.class].students.filter(([studentName, studentAbsentList]) =>
        studentAbsentList.includes(today)
    );

    res.json(absentStudents);
});

// Add absent student

app.get("/class/students/absent/toggle-absent/", isClient, (req, res) => {
    const classData = classes[req.query.class]
    const today = new Date().toDateString();

    classData.students = classData.students.map(([studentName, studentAbsentList]) => {
        if (studentName == req.query.student) {
            if (studentAbsentList.includes(today)) {
                studentAbsentList = studentAbsentList.filter(date => date !== today);
            }
            else {
                studentAbsentList.push(today)
            }
        }
        return [studentName, studentAbsentList]
    })

    const absentStudents = classes[req.query.class].students.filter(([studentName, studentAbsentList]) =>
        studentAbsentList.includes(today)
    );

    res.json(absentStudents);
})

// Admin route to get all absent students
app.get("/admin/absent/", isAdmin, (req, res) => {
    const today = new Date().toDateString();
    const absentList = [];

    Object.keys(classes).forEach(_class => {
        classes[_class].students.forEach(([studentName, studentAbsentList]) => {
            if (studentAbsentList.includes(today)) {
                absentList.push([_class, studentName]);
            }
        });
    });

    res.json(absentList);
});

// Start the server
app.listen(8080);
