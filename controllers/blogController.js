const mongoose = require('mongoose')
const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')

//get all blogs

exports.getAllBlogController = async (req, res) => {
    try {
        const blogs = await blogModel.find({}).populate('user').sort({ createdAt: -1 });
        if (!   blogs) {
            return res.status(400).send({ success: false, message: 'No blogs found' });
        }
        return res.status(200).send({ success: true, blogCount: 'blogs.length', message: 'all blogs lists', blogs });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: 'Error while getting blogs', error });
    }
};

//create blogs

exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;
        //validation
        if (!title || !description || !image || !user) {
            return res.status(400).send({ success: false, message: 'Please Provide all Fields' });
        }
        const existingUser = await userModel.findById(user);
        //validation
        if (!existingUser) {
            return res.status(401).send({ success: false, message: 'unable to find user' });
        }
        const newBlog = new blogModel({ title, description, image, user });
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({ session });
        existingUser.blogs.push(newBlog);
        await existingUser.save({ session });
        await session.commitTransaction();
        await newBlog.save();
        return res.status(201).send({
            success: true,
            message: 'Blog Created!',
            newBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: true,
            message: 'Error while creating blog',
            error
        })
    }
}
//update blog

exports.updateBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image } = req.body;

        const blog = await blogModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
        return res.status(400).send({ success: true, message: 'Blog Updated Successfully', blog })
    }
    catch (error) {
        return res.status(400).send({ success: false, message: 'Error while updating blog', error })
    }
}

//get single blog
exports.getBlogByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            return res.status(404).send({ success: false, message: 'Blog not found' });
        }
        return res.status(200).send({ success: true, message: "fetch single blog", blog });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: 'Error while getting single blog' })
    }
}

//delete blog

exports.deleteBlogController = async (req, res) => {
    try {
        const blog = await blogModel.findByIdAndDelete(req.params.id).populate('user');
        //check if blog is found and has a valid user

        if (!blog || !blog.user) {
            return res.status(404).send({ success: false, message: 'Blog not found or use info missing' });
        }
        //remove blog from the user's blog array
        blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({ success: true, message: 'Blog deleted' });
    }
    catch (error) {
        console.error(error);
        return res.status(401).send({ success: false, message: 'Error while deleting blog', error });
    }
};

//get user blog

exports.userBlogController = async (req, res) => {
    try {
        const userBlog = await userModel.findById(req.params.id).populate("blogs").sort({ createdAt: -1 });
        if (!userBlog) {
            return res.status(404).send({
                success: false,
                message: 'blogs not found with this id'
            });
        }
        return res.status(200).send({
            success: true,
            message: 'user blogs',
            userBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: 'error in user blog', error });
    }
};
