import React, { useEffect, useState } from 'react';
import '../SingleBlog/SingleBlog.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const SingleBlog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const userId = localStorage.getItem("userId");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const sendRequest = async () => {
        try {
            const { data } = await axios.get(`https://new-blog-server.onrender.com/api/blog/get-blog/${id}`);
            if (data?.success) {
                setBlog(data?.blog);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        sendRequest();
    }, [id]);

    const handleEdit = () => {
        navigate(`/blog-details/${id}`);
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`https://new-blog-server.onrender.com/api/blog/delete-blog/${id}`);
            if (data?.success) {
                window.location.reload();
                toast.success('Blog Successfully Deleted');
                navigate('/myBlogs')
            } else {
                toast.error('Failed to delete the blog.');
            }
        } catch (error) {
            console.error(error);
            toast.error('You cannot delete or edit others\' blogs');
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    if (!blog) {
        return <h1 className="text-center">Loading Blog...</h1>;
    }

    const description = blog?.description;

    // Split the description into an array of paragraphs
    const paragraphs = description ? description.split('\n') : [];

    return (
        <div>
            <section id="single-blog">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12" key={blog?._id} id={blog?._id} >
                            <h1 className="text-center">{blog.title}</h1>
                            {console.log("userId:", userId, "blog?.user?._id:", blog?.user?._id)}
                            { isLoggedIn && userId ===blog.user && (
                                <div className='buttons'>
                                    <button className='edit' onClick={()=>setIsEditDialogOpen(true)}>
                                        Edit <i className="fa-solid fa-pen-to-square" style={{ color: "#fafafa" }} />
                                    </button>
                                    <button className='delete' onClick={() => setIsDeleteDialogOpen(true)}>
                                        <i className="fa-solid fa-trash" style={{ color: "#ff0000" }} />
                                    </button>
                                </div>
                            )}
                            {isDeleteDialogOpen && (
                                <div className='delete-dialog'>
                                    <div className='delete-dialog-content'>
                                        <h5>Are You Sure You Want To Delete This Blog ?</h5>
                                        <br/><hr/>
                                        <div className='delete-dialog-buttons'>
                                            <button className='cancel' onClick={() => setIsDeleteDialogOpen(false)}>Cancel</button>
                                            <button className='delete' onClick={handleDelete}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                             {isEditDialogOpen && (
                                <div className='delete-dialog'>
                                    <div className='delete-dialog-content'>
                                        <h5>Imp Note: You Can Edit Your Article Only Once</h5><br/>
                                        <h5>Are You Sure You Want To Still Edit Your Article</h5><br/><hr/>
                                        <div className='delete-dialog-buttons'>
                                            <button className='cancel' onClick={() => setIsEditDialogOpen(false)}>Cancel</button>
                                            <button className='delete' onClick={handleEdit}>Edit</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <br />
                            <img src={blog?.image} className="single-blog-img img-fluid mx-auto d-block" alt="blog-img" />
                            <div className="author">
                                <h6 className="text-center">Published On: {blog.createdAt.slice(0, 10)}</h6>
                            </div>
                            {paragraphs.map((paragraph, index) => (
                                <p className={index === 0 ? 'desc' : ''} key={index}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
};

export default SingleBlog;
