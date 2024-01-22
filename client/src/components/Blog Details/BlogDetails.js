import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const BlogDetails = () => {
    const [inputs, setInputs] = useState({});
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const navigate = useNavigate();
    const id = useParams().id



    useEffect(() => {
        // Fetch blog details on component mount
        getBlogDetails();
    }, []);

    const getBlogDetails = async () => {
        try {
            const { data } = await axios.get(`https://new-blog-server.onrender.com/api/blog/get-blog/${id}`);
            if (data?.success) {
                // Note: It seems you're dealing with a single blog, so use setInputs instead of setBlogs
                setInputs({
                    title: data?.blog.title,
                    description: data?.blog.description,
                    image: data?.blog.image,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInputs((prevState) => ({
                ...prevState,
                image: URL.createObjectURL(file),
                imageFile: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLoggedIn) {
                const formData = new FormData();
                formData.append('image', inputs.imageFile);

                // Upload the image
                const { data: uploadImageData } = await axios.post('https://new-blog-server.onrender.com/api/blog/upload-image', formData);

                if (uploadImageData?.success) {
                    // Update the blog data
                    const blogData = {
                        title: inputs.title,
                        description: inputs.description,
                        image: uploadImageData.imageUrl,
                        // Assuming that the user ID should be part of the blog data
                        user: id,
                    };

                    // Update the blog
                    const { data: updateData } = await axios.put(`https://new-blog-server.onrender.com/api/blog/update-blog/${id}`, blogData);
                    if (updateData?.success) {
                        navigate('/');
                    } else {
                        // Handle update failure
                        console.error(updateData?.message);
                    }
                }
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageError = (e) => {
        // Handle image error by replacing with a placeholder
        e.target.src = 'https://animated-gif-creator.com/images/01/upload-animated-gif-9-gif-images-download_42.gif';
    };

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <form onSubmit={handleSubmit}>
                            <div className='form-body'>
                                <h3 className='text-center'>Publish Your Blog</h3>
                                <div className='image'>
                                    <label htmlFor='input-file'>
                                        <i className="fa-solid fa-circle-plus fa-beat" style={{ color: "#000000", fontSize: '20px' }} />
                                    </label>
                                    <input type='file' id='input-file' accept='image/*' name='image-file' onChange={handleFileChange} style={{ display: 'none' }} />
                                    <img src={inputs.image} onError={handleImageError} className='blog img-fluid' alt='Blog Preview' />
                                </div>
                                <input type='text' name='title' value={inputs.title} onChange={handleChange} placeholder='Enter Title' className='blog-input' />
                                <br />
                                <br />
                                <textarea name='description' value={inputs.description} onChange={handleChange} placeholder='Tell Us Your Story' rows={7} className='blog-input' />
                                <br />
                                <br />
                                <button type='submit' className='publish-btn' >
                                    Edit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetails;
