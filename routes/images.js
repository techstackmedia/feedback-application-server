const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');


// Define a route to retrieve all images from Cloudinary
router.get('/images', async (req, res) => {
  try {
    // Fetch a list of all images from Cloudinary
    const result = await cloudinary.v2.api.resources();

    if (!result || !result.resources) {
      return res.status(404).json({ error: 'No images found' });
    }

    // Extract the secure URLs of all images from the result
    const imageUrls = result.resources.map((resource) => resource.secure_url);

    res.json(imageUrls);
  } catch (error) {
    console.error('Error:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
});

// router.get('/image/:publicId', async (req, res) => {
//   try {
//     const publicId = req.params.publicId;

//     // Fetch the image from Cloudinary by its public ID
//     const result = await cloudinary.v2.api.resource(publicId);

//     if (!result || !result.secure_url) {
//       return res.status(404).json({ error: 'Image not found' });
//     }

//     // Redirect to the image URL (you can also send the image directly)
//     res.redirect(result.secure_url);
//   } catch (error) {
//     console.error('Error:', error);
//     res
//       .status(500)
//       .json({ error: 'Internal server error', details: error.message });
//   }
// });

module.exports = router;
