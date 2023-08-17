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
        ModuleNo: Number,
        ModuleTitle: String,
        Topics: String,
        NoOfLectures: Number
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


app.put('/api/modules/:id', async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
