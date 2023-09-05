
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { v4: uuidv4 } = require('uuid'); // Import the UUID generator
const passport = require('passport')


// Display Home Page
router.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
    // We'll tell which strategy to use
    'google',
    {
        // This request the user's profile and email
        scope: ['profile', 'email']
    }
))

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
    'google',
    {
        successRedirect: '/todos',
        failureRedirect: '/todos'
    }
))

// This is OAuth logout route
router.get('/logout', function(req, res) {
    req.logout(function() {
        res.redirect('/')
    })
})

// Display Index Page
router.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.render('todos/index', { todos, title: 'todos' });
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.redirect('/');
    }
});

// Display New Todo Form
router.get('/todos/new', (req, res) => {
    res.render('todos/new');

});


// Display View Page for a Todo
router.get('/todos/:id/view', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).render('error', { message: 'Todo not found' });
        }
        
        res.render('view', { todo });
    } catch (err) {
        console.error('Error fetching todo for viewing:', err);
        res.redirect('/todos');
    }
});

router.post('/todos', async (req, res) => {
    try {
        const { category, title, description, comments, completed } = req.body;

        // Generate a unique taskId using UUID
        const taskId = uuidv4(); // Generate a unique taskId

        // Check if a todo with the same category exists
        const existingTodo = await Todo.findOne({ category });

        if (existingTodo) {
            // Handle the duplicate, e.g., update the existing todo
            // You can customize this based on your requirements
            existingTodo.title = title;
            existingTodo.description = description;
            await existingTodo.save();

            res.redirect('/todos');
        } else {
            // Create a new todo with the unique taskId
            await Todo.create({
                taskId, // Use the generated taskId
                category,
                title,
                description,
                comments,
                completed,
            });

            res.redirect('/todos');
        }
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.taskId === 1) {
            // Handle duplicate taskId error here, e.g., send a custom error message
            console.error('Duplicate taskId error:', err);
            res.status(400).send('Task with the same category already exists.');
        } else {
            console.error('Error creating/updating todo:', err);
            res.status(500).send('Error creating/updating todo: ' + err.message);
        }
    }
});




// Display todos/show
router.get('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).render('error', { message: 'Todo not found' });
        }
        
        res.render('todos/show', { todo });
    } catch (err) {
        console.error('Error fetching todo:', err);
        res.redirect('/todos');
    }
});


// Display Edit Todo Form
router.get('/todos/:id/edit', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).render('error', { message: 'Todo not found' });
        }
        
        res.render('todos/edit', { todo });
    } catch (err) {
        console.error('Error fetching todo for editing:', err);
        res.redirect('/todos');
    }
});

// Update Todo
router.put('/todos/:id', async (req, res) => {
    try {
        const { title, category, description } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, category, description },
            { new: true } // Return the updated todo after the update
        );

        res.redirect('/todos/' + updatedTodo._id);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.redirect('/todos');
    }
});

// Update Todo/define Id
router.post('/todos/:id', async (req, res) => {
    try {
        const { title, category, description } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, category, description },
            { new: true } // Return the updated todo after the update
        );

        res.redirect('/todos/' + updatedTodo._id);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.redirect('/todos');
    }
});


// Display Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Delete Todo
router.delete('/todos/:id', async (req, res) => {
    try {
        // Find the todo by its ID and remove it
        await Todo.findByIdAndRemove(req.params.id);
        
        res.redirect('/todos');
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.redirect('/todos');
    }
});


module.exports = router;

