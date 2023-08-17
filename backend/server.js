const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/course_outcome', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
const moduleSchema = new mongoose.Schema(
    {
        ModuleNo: Int32,
        ModuleTitle: String,
        Topics: String,
        NoOfLectures: Int32
    },
    { versionKey: false } // Exclude the "__v" field
);

const CourseOutcomeModule = mongoose.model('CourseOutcomeModule', moduleSchema, 'course_outcome');

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
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
    //const { ModuleNo, ModuleTitle, Topics, NoOfLectures } = req.body;
    const newModule = new CourseOutcomeModule({
        ModuleNo: req.body.ModuleNo,
        ModuleTitle : req.body.ModuleTitle,
        Topics : req.body.Topics,
        NoOfLectures: req.body.NoOfLectures
    });
    // try {
    //     await newModule.save();
    // } catch (error) {
    //     console.error('Error saving data:', error);
    //     res.status(500).json({ error: 'Error saving data' });
    // }
    newModule.save();
    return res.redirect('back');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
