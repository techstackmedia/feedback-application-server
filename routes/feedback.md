# Feedback Server with Pagination

1. **routes/feedback.js**: This file defines various routes for handling feedback-related operations using Express.js.

   - The `express` module is imported, along with the `Feedback` model from the `../models/feedback` file.
   - A router object is created using `express.Router()`.
   - A `GET` route handles pagination to retrieve feedback items. It calculates the requested page number, skips the appropriate number of feedback items, retrieves a limited number of feedback items, and responds with the feedback items, total pages, and current page number.
   - `GET`, `POST`, `PATCH`, `PUT`, and `DELETE` routes are defined for specific feedback items based on their IDs. These routes handle retrieving, creating, updating, and deleting feedback items.
   - Each route contains `try` and `catch` blocks to handle errors. If an error occurs, a 500 Internal Server Error response is sent.

2. **models/feedback.js**: This file defines the Mongoose model for feedback items.

   - The `mongoose` module is imported.
   - A Mongoose schema named `feedbackSchema` is defined with fields for `text` (feedback content), `rating` (numeric rating), and `date` (date of feedback).
   - The `Feedback` model is created using the schema definition and exported.

3. **index.js**: This is the main application file where everything comes together.

   - Modules like `express`, `mongoose`, `body-parser`, `debug`, and `dotenv` are imported.
   - Debuggers are set up to log specific messages.
   - Express application is created and middleware for parsing JSON is added.
   - Mongoose is connected to the MongoDB database using the `DATABASE_URI` from the environment variables.
   - Routes are registered using `app.use('/feedback', feedbackRoutes)`.
   - The server is started and listens on the specified port.

4. **package.json**: This file includes project information and dependencies.

   - It lists various dependencies like `express`, `mongoose`, `body-parser`, `debug`, and `dotenv`.
   - It defines scripts for starting the application normally and in development mode using `nodemon`.

**Refactoring into Separate Files and Folders:**

To improve code organization and maintainability, you can separate the different components into folders and files:

1. **Create a `controllers` Folder:**

   Inside the `routes` folder, create a new folder named `controllers`. In this folder, create a file named `feedbackController.js`. Move the route handling logic from `routes/feedback.js` into this controller file. The controller file will export functions that handle each route's logic.

2. **controllers/feedbackController.js:**
   If controllers were included, then the code would look as shown below:

   ```javascript
   const Feedback = require('../models/feedback');

   async function getFeedback(req, res) {
     // ... Move the code from the GET / route here ...
   }

   async function getFeedbackById(req, res) {
     // ... Move the code from the GET /:id route here ...
   }

   async function createFeedback(req, res) {
     // ... Move the code from the POST / route here ...
   }

   async function updateFeedback(req, res) {
     // ... Move the code from the PATCH /:id and PUT /:id routes here ...
   }

   async function deleteFeedback(req, res) {
     // ... Move the code from the DELETE /:id route here ...
   }

   module.exports = {
     getFeedback,
     getFeedbackById,
     createFeedback,
     updateFeedback,
     deleteFeedback,
   };
   ```

3. **routes/feedback.js:**

   ```javascript
   const express = require('express');
   const feedbackController = require('../controllers/feedbackController');

   const router = express.Router();

   router.get('/', feedbackController.getFeedback);
   router.get('/:id', feedbackController.getFeedbackById);
   router.post('/', feedbackController.createFeedback);
   router.patch('/:id', feedbackController.updateFeedback);
   router.put('/:id', feedbackController.updateFeedback);
   router.delete('/:id', feedbackController.deleteFeedback);

   module.exports = router;
   ```

4. **Reorganize Models:**

   Keep the `models/feedback.js` file as it is.

5. **Use a `routes/index.js` File:**

   Create a file named `index.js` inside the `routes` folder. In this file, import and export all your route files. This provides a single entry point for all your routes.

   ```javascript
   const express = require('express');
   const feedbackRoutes = require('./feedback');

   const router = express.Router();

   router.use('/feedback', feedbackRoutes);

   module.exports = router;
   ```

6. **Use the New `routes/index.js` in `index.js`:**

   Modify your `index.js` file to use the new `routes/index.js` file.

   ```javascript
   // ... Other imports ...

   const feedbackRoutes = require('./routes');

   // ... App setup ...

   app.use(feedbackRoutes);

   // ... Server startup ...
   ```

This refactoring organizes your code into separate files and folders, improving maintainability and readability. Each route's logic is contained within its own controller function, making it easier to manage and understand. The main `index.js` file becomes cleaner by using the organized routes.

Try checking out to the branch `05-pagination` to see the code:

```js
const express = require('express');
const Feedback = require('../models/feedback');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page number
    const limit = 10; // Set the number of feedback items per page
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    const feedbackCount = await Feedback.countDocuments(); // Get the total count of feedback items
    const totalPages = Math.ceil(feedbackCount / limit); // Calculate the total number of pages

    const feedback = await Feedback.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      feedback,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newFeedback = await Feedback.create({
      text: req.body.text,
      rating: req.body.rating,
      date: Date.now(),
    });
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    req.body.date = Date.now();
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    req.body.date = Date.now();
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFeedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.json(updatedFeedback);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```
