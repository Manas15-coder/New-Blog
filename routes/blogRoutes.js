const express = require('express');
const { getAllBlogController, createBlogController, updateBlogController, deleteBlogController, userBlogController, getBlogByIdController } = require('../controllers/blogController');

const router = express.Router();

//get all blogs
router.get('/all-blog', getAllBlogController);
//create blog
router.post('/create-blog', createBlogController);
//update blog
router.put('/update-blog/:id', updateBlogController);
//delete blog
router.delete('/delete-blog/:id', deleteBlogController);
//get user blog
router.get('/user-blog/:id', userBlogController);
//get single blog
router.get('/get-blog/:id', getBlogByIdController);

module.exports = router;
