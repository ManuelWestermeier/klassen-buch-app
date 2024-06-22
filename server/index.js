import express from "express";
import cors from "cors";
import crypto from 'crypto';
import { log } from "console";
import { writeFileSync } from "fs";

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
    return crypto.createHash('sha256').update(password + "").digest('hex');
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
    const { class: className, password } = req.query;
    const classData = classes[className];

    if (!className || !password || !classData || classData.password !== password) {
        if (hashPassword(password) === adminPasswordHash) {
            return next();
        }
        return res.status(401).json("not auth");
    }

    next();
};

// Mock classes data
const classes = {
    "10a": {
        password: "dhajw2",
        students: [
            ["hans xy", [new Date().toLocaleDateString()], []],
            ["Henrik Killman", [], []]
        ],
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
    const { class: className, password } = req.query;
    const isAuth = classes[className]?.password === password;
    if (!isAuth) {
        return res.json(false);
    }
    res.json(true);
});

// Route to get students of a class
app.get("/class/students/", isClient, (req, res) => {
    const { class: className } = req.query;
    res.json(classes[className].students.map(([name]) => name));
});

// Route to get absent students of a class
app.get("/class/students/absent/", isClient, (req, res) => {
    const today = new Date().toLocaleDateString();
    const { class: className } = req.query;

    const absentStudents = classes[className].students.filter(([_, absentDates]) =>
        absentDates.includes(today)
    );

    res.json(absentStudents.map(([name, absentDates, completedStudentAbsentList]) =>
        [name, absentDates, completedStudentAbsentList.includes(today)]
    ));
});

setInterval(() => {
    writeFileSync("data.json", JSON.stringify(classes, null, 2), "utf-8");
}, 10000);

// Add absent student
app.get("/class/students/absent/toggle-absent/", isClient, (req, res) => {
    const { class: className, "student-absent": studentName, feature } = req.query;
    const today = new Date().toLocaleDateString();

    if (typeof className !== "string" || typeof studentName !== "string" || !["add", "delete"].includes(feature)) {
        return res.status(400).json({ error: "Invalid request" });
    }

    const classData = classes[className];

    classData.students = classData.students.map(([name, absentDates, completedStudentAbsentList]) => {
        if (name === studentName) {
            if (feature === "add" && !absentDates.includes(today)) {
                absentDates.push(today);
            } else if (feature === "delete" && absentDates.includes(today)) {
                absentDates = absentDates.filter(date => date !== today);
            }
        }
        return [name, absentDates, completedStudentAbsentList];
    });

    classes[className] = classData;

    const absentStudents = classData.students.filter(([_, absentDates]) => absentDates.includes(today));
    res.json(absentStudents);
});

// Admin Routes
app.get("/admin/login/", (req, res) => {
    const hashedPassword = hashPassword(req.query.password);
    res.json(hashedPassword === adminPasswordHash);
});

// Admin route to get all absent students
app.get("/admin/absent/", isAdmin, (req, res) => {
    const today = new Date().toLocaleDateString();
    const absentList = [];

    Object.keys(classes).forEach(className => {
        classes[className].students.forEach(([studentName, absentDates, completedStudentAbsentList]) => {
            if (absentDates.includes(today) && !completedStudentAbsentList.includes(today)) {
                absentList.push([studentName, className, absentDates]);
            }
        });
    });

    res.json(absentList);
});

// Admin route to remove absent student
app.get("/admin/absent/complete", isAdmin, (req, res) => {
    const today = new Date().toLocaleDateString();
    const { class: className, "student-absent": studentName } = req.query;

    if (typeof className !== "string" || typeof studentName !== "string") {
        return res.status(400).json({ error: "Invalid class or student name" });
    }

    const classData = classes[className];

    classData.students = classData.students.map(([name, absentDates, completedStudentAbsentList]) => {
        if (name === studentName && !completedStudentAbsentList.includes(today)) {
            completedStudentAbsentList.push(today);
        }
        return [name, absentDates, completedStudentAbsentList];
    });

    classes[className] = classData;

    const absentList = [];
    Object.keys(classes).forEach(className => {
        classes[className].students.forEach(([studentName, absentDates, completedStudentAbsentList]) => {
            if (absentDates.includes(today) && !completedStudentAbsentList.includes(today)) {
                absentList.push([studentName, className, absentDates, completedStudentAbsentList]);
            }
        });
    });

    res.json(absentList);
});

// Start the server
app.listen(8080);