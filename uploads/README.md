# File Upload

This code represents an Express.js server that handles feedback submissions, retrieval, updates, and deletions using a MongoDB database. Additionally, it employs Multer middleware for handling file uploads, such as profile images associated with feedback. I'll break down the code step by step:

1. **Server Setup**:
   The code begins with importing the required modules like `express`, `mongoose`, and others. The server is created using `express()` and configured to use the `bodyParser` middleware to parse JSON data in the request body.

2. **Database Connection**:
   The server establishes a connection to a MongoDB database using the `mongoose` library. The connection string is fetched from the environment variables using `dotenv`. If the connection is successful, it logs "MongoDB Connected", otherwise, it logs an error message.

3. **Feedback Model**:
   The feedback model is defined using Mongoose's schema and model system. The schema includes fields for `text` (feedback text), `rating` (numerical rating), `date` (submission date), and `profileImage` (filename of the associated profile image). The `Feedback` model is created based on this schema and exported.

4. **File Upload Setup**:
   The code defines a storage configuration for the Multer middleware. Uploaded files will be stored in the 'uploads/' directory. The filename for each uploaded file is generated using a combination of the current timestamp and a random number.

5. **Routes for Feedback Handling**:
   The code sets up various routes for handling feedback operations:

   - `POST /feedback`: This route allows users to submit feedback. It utilizes the `upload.single('profileImage')` middleware to handle single file uploads. The uploaded file's information is accessible in `req.file`, and the feedback data is parsed from `req.body`. A new feedback document is created in the database, including the filename of the uploaded image.

   - `GET /feedback`: This route retrieves feedback in a paginated manner. It calculates the requested page number, skips the appropriate number of items, and limits the number of items per page. The total number of pages is also calculated. Feedback items are retrieved from the database and returned in the response.

   - `GET /feedback/:id`: This route retrieves a single feedback item based on the provided `id` parameter.

   - `PATCH /feedback/:id`: This route updates a feedback item with the provided `id`. The updated feedback is returned in the response.

   - `PUT /feedback/:id`: Similar to `PATCH`, this route updates a feedback item. If the item doesn't exist, a 404 response is returned.

   - `DELETE /feedback/:id`: This route deletes a feedback item based on the provided `id`. A 204 response is sent upon successful deletion.

6. **Server Start**:
   The server is started on the specified port (either from the environment variable `BACKEND_PORT` or 5000 if not provided). It listens to incoming requests and routes them according to the defined routes.

7. **Middleware Usage**:
   The Multer middleware setup (`upload.single('profileImage')`) is used in the `POST /feedback` route to handle file uploads. It expects the uploaded file to be attached to the field named `profileImage` in the request.

To upload an image using Postman:

1. Set the HTTP method to POST.
2. Set the URL to match the server's URL for feedback submissions (`http://localhost:5000/feedback`).
3. In the "Body" section of the request, select "form-data".
4. Add a field with the key `text` and the feedback text as the value.
5. Add a field with the key `rating` and the numerical rating as the value.
6. Add a field with the key `profileImage` and select a file to upload as the value.
7. Click "Send" to make the request.

Remember, the uploaded file should be named `uploads` and should be located in the root directory of your project for the uploaded files to be saved there, as indicated by the comment in the code. Make sure to adjust the server URL and port to match your environment.

---

Here's an example of how you could use `curl` to simulate a POST request to the server with a JSON response similar to what you provided:

Assuming the server is running locally at `http://localhost:5000`, you can use the following `curl` command in your terminal:

```bash
curl -X POST -F "text=This is a text." -F "rating=10" -F "profileImage=@path/to/your/image.jpg" http://localhost:5000/feedback
```

In this command:

- `-X POST` specifies the HTTP method as POST.
- `-F` specifies form data fields. You provide the feedback text, rating, and image file.
- `@path/to/your/image.jpg` is the path to the image file you want to upload.

This command simulates a file upload with form data, similar to how it would be done in Postman.

The expected response in JSON format would be similar to the one you provided:

```json
{
  "text": "This is a text.",
  "rating": 10,
  "date": "2023-08-29T19:30:00.714Z",
  "profileImage": "1693337400692-392058386.jpg",
  "_id": "64ee473819c31ad15e77b065",
  "__v": 0
}
```

Please make sure to replace `"@path/to/your/image.jpg"` with the actual path to the image you want to upload and adjust the URL (`http://localhost:5000/feedback`) if your server is running on a different host or port.
