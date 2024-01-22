import React, { useState } from 'react';
import '../CreateBlog/CreateBlog.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';


const CreateBlog = () => {
    const id = localStorage.getItem('userId');
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        title: '',
        description: '',
        image: '',
    });

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setInputs((prevState) => ({
                ...prevState,
                image: URL.createObjectURL(file), // Display the selected image preview
                imageFile: file, // Store the selected image file
            }));
        }
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLoggedIn) {
                // Create a FormData object to send the image file
                const formData = new FormData();
                formData.append('image', inputs.imageFile);

                // Send the image file to the server for processing
                const { data } = await axios.post('https://new-blog-server.onrender.com/api/blog/upload-image', formData);

                if (data?.success) {
                    // Now, you can proceed with creating the blog post with the image URL
                    const blogData = {
                        title: inputs.title,
                        description: inputs.description,
                        image: data.imageUrl,
                        user: id,
                    };

                    const response = await axios.post('https://new-blog-server.onrender.com/api/blog/create-blog', blogData);

                    if (response.data?.success) {
                        toast.success('Blog Created');
                        navigate('/');
                    }
                }
            }
            else {
                toast.error('Login to create Blog')
                navigate('/login')
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleImageError = (e) => {
        e.target.src = 'https://animated-gif-creator.com/images/01/upload-animated-gif-9-gif-images-download_42.gif';
    };

    return (
        <>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <form onSubmit={handleSubmit}>
                            <div className='form-body'>
                                <h3 className='text-center'>What's On Your Mind, {localStorage.getItem("userName")}</h3>
                                <div className='image'>
                                    <label htmlFor='input-file'>
                                        <i className="fa-solid fa-circle-plus fa-beat" style={{ color: "#000000", fontSize: '20px' }} />
                                    </label>
                                    <input type='file' id='input-file' accept='image/*' name='image-file' onChange={handleFileChange} style={{ display: 'none' }} />
                                    <img src={inputs.image} onError={handleImageError} className='blog img-fluid' />
                                </div>
                                <input type='text' name='title' value={inputs.title} onChange={handleChange} placeholder='Enter Title' className='blog-input' required />
                                <br />
                                <br />
                                <textarea name='description' value={inputs.description} onChange={handleChange} placeholder='Tell Us Your Story' rows={7} className='blog-input' required />
                                <br />
                                <br />
                                <button type='submit' className='publish-btn'>
                                    Publish
                                </button>
                            </div>
                        </form>
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                        />
                    </div>
                </div>

            </div>
        </>
    );
};

export default CreateBlog;
