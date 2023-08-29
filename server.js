const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const app = express();
app.use(bodyParser.json());

// Establish the connection to the educational_platform database
const educationalPlatformDb = mongoose.createConnection('mongodb://localhost:27017/educational_platform', { useNewUrlParser: true, useUnifiedTopology: true });

educationalPlatformDb.once('open', () => {
    console.log('Connected to educational_platform database');
});

educationalPlatformDb.on('error', (err) => {
    console.error('Error connecting to educational_platform database:', err);
});

// Session store
const store = new MongoDBSession({
    uri: 'mongodb://localhost:27017/educational_platform_sessions',
    collection: 'sessions'
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: store
}));

// User schema for educational_platform
const eduUserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const EduUser = educationalPlatformDb.model('User', eduUserSchema);

// Establish the connection to the course_outcome database
const courseOutcomeDb = mongoose.createConnection('mongodb://localhost:27017/course_outcome', { useNewUrlParser: true, useUnifiedTopology: true });

courseOutcomeDb.once('open', () => {
    console.log('Connected to course_outcome database');
});

courseOutcomeDb.on('error', (err) => {
    console.error('Error connecting to course_outcome database:', err);
});

// Define module schema for course_outcome
const courseOutcomeModuleSchema = new mongoose.Schema(
    {
        ModuleNo: Number,
        ModuleTitle: String,
        Topics: String,
        NoOfLectures: Number
    },
    { versionKey: false }
);

const courseSchema = new mongoose.Schema(
    {
        coid: String,
        cotitle: String,
        colevels: String
    },
    { versionKey: false }
);
const cdSchema = new mongoose.Schema(
    {
        co_code: String,
        sem: String,
        co_name: String,
        credits: Number,
        contact_hours: String,
        coordinators:String,
        teachers:String
    },
    { versionKey: false }
);

const CourseOutcomeModule = courseOutcomeDb.model('CourseOutcomeModule', courseOutcomeModuleSchema, 'course_outcome');
const course = courseOutcomeDb.model('CourseOutcomeModule', courseSchema, 'course');
const cd = courseOutcomeDb.model('CourseOutcomeModule', cdSchema, 'coursedetail');


app.use(express.static(path.join(__dirname, 'frontend')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'adminlogin.html'));
});



app.post('/admin-login', async (req, res) => {
    try {
        const user = await EduUser.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            res.sendFile(path.join(__dirname, 'frontend', 'course.html'));
        } else {
            res.send('Invalid login credentials');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/coordinator-login', async (req, res) => {
    try {
        const user = await EduUser.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            res.sendFile(path.join(__dirname, 'frontend', 'course.html'));
        } else {
            res.send('Invalid login credentials');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/forgot-password', (req, res) => {
    // Handle the logic for forgot password here
    // You can send an email with a reset password link, for example
    res.send('Forgot Password Page');
});

app.post('/username-recovery', (req, res) => {
    // Handle the logic for username recovery here
    // You can send an email with the username or display it on this page
    res.send('Username Recovery Page');
});

app.post('/create-account', (req, res) => {
    // Handle the logic for username recovery here
    // You can send an email with the username or display it on this page
    res.send('Username Recovery Page');
});


app.post('/login', (req, res) => {
    const selectedRole = req.body.role;

    // You can add logic here to redirect the user based on the selected role
    if (selectedRole === 'coordinator') {
        // Redirect the coordinator to their login page
        res.sendFile(path.join(__dirname, 'frontend', 'corlogin.html'));
    } else if (selectedRole === 'admin') {
        // Redirect the admin to their login page
        res.sendFile(path.join(__dirname, 'frontend', 'adminlogin.html'));
    } else if (selectedRole === 'teacher') {
        // Redirect the teacher to their login page
        res.sendFile(path.join(__dirname, 'frontend', 'teacherlogin.html'));
    } else {
        // Handle invalid role selection
        res.send('Invalid role selected');
    }
});


app.post('/teacher-login', async (req, res) => {
    try {
        const user = await EduUser.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            res.sendFile(path.join(__dirname, 'frontend', ''));
        } else {
            res.send('Invalid login credentials');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.get('/api/cd', async (req, res) => {
    try {
        const modules = await cd.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        const modules = await course.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.get('/api/modules', async (req, res) => {
    try {
        const modules = await CourseOutcomeModule.find();
        res.json(modules);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.post('/api/modules', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const newModule = new CourseOutcomeModule(req.body);
     try {
         await newModule.save();
         res.json(newModule);
     } catch (error) {
         console.error('Error saving data:', error);
         res.status(500).json({ error: 'Error saving data' });
     }
 });

 app.post('/api/courses', async (req, res) => {
    // const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const newModule = new course(req.body);
     try {
         await newModule.save();
         res.json(newModule);
     } catch (error) {
         console.error('Error saving data:', error);
         res.status(500).json({ error: 'Error saving data' });
     }
 });



app.put('/api/module/:id', async (req, res) => {
    const moduleId = req.params.id;
    const updatedModule = req.body;
    
    try {
        await CourseOutcomeModule.findByIdAndUpdate(moduleId, updatedModule);
        res.json(updatedModule);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
});

app.put('/api/course/:id', async (req, res) => {
    const moduleId = req.params.id;
    const updatedModule = req.body;
    
    try {
        await course.findByIdAndUpdate(moduleId, updatedModule);
        res.json(updatedModule);
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
});


app.delete('/api/modules/:id', async (req, res) => {
    const moduleId = req.params.id;
    
    try {
        await CourseOutcomeModule.findByIdAndDelete(moduleId);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    const moduleId = req.params.id;
    
    try {
        await course.findByIdAndDelete(moduleId);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Error deleting data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
