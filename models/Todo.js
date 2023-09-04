// Import Mongoose
const mongoose = require('mongoose')
// Now we write the rules for our movies
const todoSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    comments: [{
      type: String,
    }],
    completed: {
      type: Boolean,
      default: false,
    },
  
  },  
      
  {
    timestamps: true, // Add timestamps fields createdAt and updatedAt
  }
);

// Our schema need to compile into a model, we'll export the model to use in our controllers/routes
// Every single model has functions baked into them, these functions allow us to CRUD on these resources(more on that in controllers)
// model is method that comes from mongoose, it takes two arguments
// The first argument is the NAME we want to use to refer to the model(capitalized first letter)
// The second argument is the schema used to create the model
const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;