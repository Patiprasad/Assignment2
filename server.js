const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/persondb')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    mobileNumber: { type: String, required: true }
}, { timestamps: true });

const Person = mongoose.model('Person', personSchema);

app.get('/person', async (req, res) => {
    try {
        const people = await Person.find();
        res.render('index', { people });
    } catch (err) {
        res.status(500).render('error', { message: 'Error fetching people', error: err });
    }
});

app.get('/person/new', (req, res) => {
    res.render('create');
});

app.post('/person', async (req, res) => {
    try {
        const { name, age, gender, mobileNumber } = req.body;
        const newPerson = new Person({ name, age, gender, mobileNumber });
        await newPerson.save();
        res.redirect('/person');
    } catch (err) {
        res.status(500).render('error', { message: 'Error creating person', error: err });
    }
});

app.get('/person/:id/edit', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) {
            return res.status(404).render('error', { message: 'Person not found', error: {} });
        }
        res.render('edit', { person });
    } catch (err) {
        res.status(500).render('error', { message: 'Error fetching person', error: err });
    }
});

app.put('/person/:id', async (req, res) => {
    try {
        const { name, age, gender, mobileNumber } = req.body;
        const person = await Person.findByIdAndUpdate(
            req.params.id,
            { name, age, gender, mobileNumber },
            { new: true, runValidators: true }
        );
        if (!person) {
            return res.status(404).render('error', { message: 'Person not found', error: {} });
        }
        res.redirect('/person');
    } catch (err) {
        res.status(500).render('error', { message: 'Error updating person', error: err });
    }
});

app.get('/person/:id/delete', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) {
            return res.status(404).render('error', { message: 'Person not found', error: {} });
        }
        res.render('delete', { person });
    } catch (err) {
        res.status(500).render('error', { message: 'Error fetching person', error: err });
    }
});

app.delete('/person/:id', async (req, res) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);
        if (!person) {
            return res.status(404).render('error', { message: 'Person not found', error: {} });
        }
        res.redirect('/person');
    } catch (err) {
        res.status(500).render('error', { message: 'Error deleting person', error: err });
    }
});

app.get('/', (req, res) => {
    res.redirect('/person');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
