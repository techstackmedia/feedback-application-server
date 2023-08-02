# Feedback App Server

## Table of Contents

- [Description](#description)
- [Connecting To A Remote Server Using Mongoose](#connecting-to-a-remote-server-using-mongoose)
- [Packages](#packages)
- [Testing](#testing)
- [Deployment](#deployment)

## Description

## Description

1. `const express = require('express');`:
   This line imports the Express.js library, which is a web framework for Node.js. Express simplifies the process of building web applications and APIs by providing a set of methods and middleware for handling HTTP requests and responses.

2. `const mongoose = require('mongoose');`:
   This line imports the Mongoose library, which is an Object-Document Mapping (ODM) library for MongoDB and Node.js. Mongoose provides a higher-level abstraction over MongoDB and allows you to define schemas and models for your data.

3. `const bodyParser = require('body-parser');`:
   This line imports the `body-parser` middleware, which is used to parse incoming request bodies in the middleware chain. It allows you to access the request body data in a more convenient way.

4. `const app = express();`:
   This line creates an instance of the Express application, which represents your web server.

5. `const port = 5000;`:
   This line defines the port number on which your server will listen. You can change this port number to any other available port.

6. `app.use(bodyParser.json());`:
   This line sets up the `body-parser` middleware to parse incoming JSON data. This is necessary for handling JSON data sent in POST and PATCH requests.

7. Mongoose Schema and Model:
   The code defines a Mongoose schema for the `Feedback` collection in MongoDB. The schema specifies the structure of each document in the collection, including the fields (`text` and `rating`) and their data types.

8. `const Feedback = mongoose.model('Feedback', feedbackSchema);`:
   This line creates a Mongoose model based on the defined schema. The model represents the `Feedback` collection and provides an interface to interact with the database.

9. Routes:
   The code defines six routes that handle different HTTP methods (GET, POST, PATCH, DELETE) for the `/feedback` endpoint:

   a. `GET /feedback`: Retrieves all feedback documents from the MongoDB collection, sorts them in descending order based on the `id`, and sends the data as a JSON response.

   b. `GET /feedback/:id`: Retrieves a specific feedback document from the MongoDB collection based on its unique identifier (`id`) specified in the URL. If the feedback document is found, it is sent as a JSON response. If not found, the server responds with a status code 404 (Not Found).

   c. `POST /feedback`: Creates a new feedback document based on the request body (`req.body`) and saves it to the MongoDB collection. It then sends the newly created feedback document as a JSON response with a status code 201 (Created).

   d. `PATCH /feedback/:id`: Updates an existing feedback document in the MongoDB collection. The `:id` parameter in the URL represents the unique identifier of the feedback to update. The updated feedback document is sent as a JSON response. If the feedback document is not found, the server responds with a status code 404 (Not Found).

   e. `PUT /feedback/:id`: Updates an existing feedback document in the MongoDB collection using the `PUT` method. The `:id` parameter in the URL represents the unique identifier of the feedback to update. The updated feedback document is sent as a JSON response. If the feedback document is not found, the server responds with a status code 404 (Not Found).

   f. `DELETE /feedback/:id`: Deletes a feedback document from the MongoDB collection based on its unique identifier specified in the URL. The server responds with a status code 204 (No Content) to indicate successful deletion. If the feedback document is not found, the server responds with a status code 404 (Not Found).

10. Connect to MongoDB and Start the Server:
    The code connects to the MongoDB database using Mongoose and starts the Express server to listen for incoming requests on the specified port. If the connection to MongoDB is successful, it prints a message indicating that the server has started.

To summarize, we've sets up an Express server with Mongoose to handle full CRUD operations for the `Feedback` collection. The server listens on port 5000, and when a request is received, it interacts with the MongoDB database to perform the requested operation (e.g., retrieving data, creating, updating, or deleting a feedback document). The server then sends appropriate responses back to the client (frontend) in the form of JSON data or status codes to indicate the success or failure of the operation.

## Connecting To A Remote Server Using Mongoose

Let's break down the steps for setting up and using [MongoDB Atlas](https://www.mongodb.com/) with username and password, making the network (IP address) active, and creating and using a shared cluster (free tier):

1. **Create a Shared Cluster on MongoDB Atlas**:

   - Go to MongoDB Atlas website and [log in](https://account.mongodb.com/account/login) or [create an account](https://account.mongodb.com/account/register) if you don't have one.
   - Click on "Create a New Cluster" or "Build a Cluster" button to start creating a new cluster.
   - If the cluster type is set to "Dedicated", click on "Shared" (free tier) cluster type.
   - Choose a name for your cluster or use the default name.
   - Click on "Create Cluster" to create the shared cluster.

2. **Create a Database User**:

   - In the MongoDB Atlas dashboard, click on "Database Access" in the sidebar.
   - Click on the "Add New Database User" button.
   - Fill in the username and a strong password of your choice in the authentication fields.
   - Copy the username and password of the newly created user. You will need to use them in your application code later.
   - Select an appropriate option for a built-in role (e.g., "Atlas Admin") for the user.
   - Click on the "Add User" button to create the database user.

3. **Store Username and Password in .env File**:

   - Create a `.env` file in the root directory of your application if you don't have one.
   - Inside the `.env` file, add the following lines:

     ```txt
     DATABASE_USERNAME=your_username
     DATABASE_PASSWORD=your_password
     ```

   You can utilize the environment variable values based on how you set up your environment variables in the `.env` file. For this application, the environment variables are configured as follows:

   ```plaintext
   BACKEND_PORT=5000
   DATABASE_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

   Please ensure to replace `<username>` and `<password>` with the actual credentials of the database user you created in MongoDB Atlas. These environment variables will be used in the application to specify the port on which the backend server will run (`BACKEND_PORT`) and the connection URI to the MongoDB database (`DATABASE_URI`).

   Replace `your_username` and `your_password` with the actual values you copied from MongoDB Atlas.

4. **Make Network Access Active**:

   - In the MongoDB Atlas dashboard, click on "Network Access" in the sidebar.
   - If the status is already active, skip this step. Otherwise, click on the "Edit" button to enable network access.
   - If you want to allow the IP address to be globally accessible, edit the row with IP address `0.0.0.0/0`.
   - Click on "Confirm" to activate network access. The status should become "Active". If the stutus is still inactive, go back to the Database in the sidebar and click the "Resume" button.

5. **Get the Connection String**:

   - Go back to the "Database" link in the sidebar and click on "Connect".
   - Under the "Connect Your Application" section, choose your preferred driver from the "Drivers" dropdown.
   - Copy the connection string provided for your selected driver. It will look something like this:

     ```txt
     mongodb+srv://<username>:<password>@<cluster-url>/test?retryWrites=true&w=majority
     ```

   - Paste this connection string into your application code (e.g., in the `.env` file) to use it for connecting to the MongoDB database.

6. **Close the Modal**:
   - Close the connection modal.

With these steps, you have set up MongoDB Atlas with a shared cluster, created a database user with a username and password, activated network access, and obtained the connection string. You can now use the connection string in your application code to connect to the MongoDB database hosted on MongoDB Atlas.

## Packages

To install `nodemon` globally, follow these steps:

1. Open a terminal or command prompt on your computer.
2. Run the following command to install `nodemon` globally:

   ```bash
   npm install -g nodemon
   ```

   The `-g` flag tells npm to install the package globally, making `nodemon` accessible from any directory in your system.

After installing `nodemon`, you can use it to run your server during development. In your `package.json` file, you have two scripts defined: `"start"` and `"dev"`.

- `"start": "node index.js"`: This script runs the server using the Node.js command, without `nodemon`. It simply starts your server, but it won't automatically restart when changes are made to the application.

- `"dev": "set DEBUG=app:db,app:bug,app:port & npx nodemon"`: This script runs the server with `nodemon`, which is useful during development. The `set DEBUG` part is used to set the debugging options for `nodemon`. The `&` symbol is used to separate multiple commands in a single line, and `npx nodemon` runs `nodemon` from the installed dependencies in your project.

If you want to clone the repository and install all the packages, run the following commands

```bash
git clone https://github.com/techstackmedia/feedback-application-server.git
cd feedback-application-server
npm install  # Installs all required modules for the development environment only!
```

With this setup, you can start your server in two ways:

1. Without `nodemon`: You can run the following command to start the server normally (without automatic restart on changes):

   ```bash
   npm start
   ```

   This will execute the `"start"` script, and the server will start using `node index.js`.

2. With `nodemon`: You can run the following command to start the server with `nodemon` (automatic restart on changes):

   ```bash
   npm run dev
   ```

   This will execute the `"dev"` script, and the server will start using `nodemon`.

Explanation of the dependencies in `package.json`:

- `"body-parser": "^1.20.2"`: A middleware for Express that parses incoming request bodies and makes the data available in `req.body`. This is used to handle JSON data sent in POST and PATCH requests.

- `"debug": "^4.3.4"`: A debugging utility for Node.js applications. It provides an easy way to add debug logs to your application, which can be enabled or disabled based on environment variables.

- `"dotenv": "^16.3.1"`: A package that loads environment variables from a `.env` file into `process.env`. This allows you to store sensitive configuration data (e.g., database credentials) in a separate file and keep them out of version control.

- `"express": "^4.18.2"`: The Express.js web framework for Node.js. It simplifies the process of building web applications and APIs by providing a set of methods and middleware for handling HTTP requests and responses.

- `"mongoose": "^7.4.1"`: An Object-Document Mapping (ODM) library for MongoDB and Node.js. Mongoose provides a higher-level abstraction over MongoDB and allows you to define schemas and models for your data.

In summary, the provided `package.json` file sets up two scripts for starting the server, one using `nodemon` for automatic restart on changes during development, and another without `nodemon` for production use. It also lists the necessary dependencies required for building the server, including `express`, `mongoose`, `body-parser`, `debug`, and `dotenv`.

## Testing

If you already have a frontend application, you can test the backend API directly from the UI. However, it is recommended to use an API testing platform such as [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest), [Thunder Client](https://www.thunderclient.io/), [RapidAPI Client](https://rapidapi.com/), etc., to get a clear understanding of the API responses. Additionally, you can try testing the application in the client at [Feedback App client-side](https://techstackmedia.github.io/react-front-to-back/). For further information, please refer to the frontend documentation available at [https://github.com/techstackmedia/react-front-to-back](https://github.com/techstackmedia/react-front-to-back).

## Pushing to GitHub

To push your project to GitHub and track your changes, follow these steps:

1. **Create a GitHub Repository**:

   - Go to GitHub website and log in or create an account if you don't have one.
   - Click on the "New" button to create a new repository.
   - Give your repository a name and optionally provide a description.
   - Choose the repository visibility (public or private) as per your preference.
   - Click on the "Create repository" button to create the repository.

2. **Ignore Core Files and Folders**:

   - It is essential to exclude certain files and folders from being tracked by version control, especially sensitive data like the `.env` file and the `node_modules` folder.
   - Create a file named `.gitignore` in the root directory of your project.
   - Inside the `.gitignore` file, add the following lines to exclude the mentioned files and folder:

     ```txt
     .env
     node_modules/
     ```

3. **Initialize Git Repository and Commit Changes**:

   - Open your terminal or command prompt in the root directory of your project.
   - Run the following commands to initialize a new Git repository, add all the files to the staging area, and make an initial commit with a commit message:

     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     ```

4. **Add Remote Origin**:

   - Now, link your local repository to the remote GitHub repository you created in step 1. Replace `<username>` and `<repository-name>` with your GitHub username and the name of the repository you created, respectively.
   - Run the following command in your terminal to add the remote origin:

     ```bash
     git remote add origin "https://github.com/<username>/<repository-name>"
     ```

5. **Push to GitHub**:

   - Finally, push your local repository to GitHub using the following command:

     ```bash
     git push -u origin master
     ```

   - This will push your code to the `master` branch of your GitHub repository.

> You can now optionally deploy your backend app directly from your GitHub repository using any API deploying platform of your choice.

By following these steps, you will have successfully pushed your backend application code to GitHub, allowing you to track changes, collaborate with others, and deploy your application easily. Remember to keep your sensitive data (e.g., API keys, database credentials) protected by using the `.gitignore` file to prevent them from being exposed on version control platforms.

## Deployment

Deploy your backend application on a platform of your choice. Below are some commonly used platforms:

- [Render](https://render.com/)
- [Cyclic](https://cyclic.sh/)
- [Heroku](https://www.heroku.com/)

Please ensure you follow the platform-specific guidelines for deploying your backend application to ensure a smooth and successful deployment.
