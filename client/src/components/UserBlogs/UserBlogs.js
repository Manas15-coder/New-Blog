import React, { useEffect, useState } from 'react'
import '../UserBlogs/UserBlogs.css'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom';

const UserBlogs = () => {

    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`http://localhost:5000/api/blog/delete-blog/${id}`);
            navigate('/')
            if (data?.success) {
                toast.success('Blog Successfully Deleted')
            }
        } catch (error) {
            console.log(error)
        };
    }


    const sendRequest = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const { data } = await axios.get(`https://new-blog-server.onrender.com/api/blog/user-blog/${userId}`);
            if (data?.success) {
                setBlogs(data?.userBlog.blogs);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        sendRequest();
    }, []);

    if (!blogs) {
        return <h1 className='text-center'>Loading Blogs ....</h1>;
    }
    return (
        <div>
            <section id='user-blog-section'>
                <div className='container'>
                    <div className='row'>
                        {blogs.length === 0 ? (<h1 className='text-center'>No Blogs Available....</h1>) :
                            (
                                blogs && (blogs.map((blog) => (
                                    <div class='col-md-12' key={blog?._id}>
                                        <div class='user-blog-wrapper' id={blog?._id} key={blog._id} isUser={localStorage.getItem("userId") === blog?.user?._id}>
                                            <img src={blog.image}
                                                alt='blog-img' class='user-blog-img img-fluid mx-auto' />
                                            <div class='blog-body'>
                                                <div class="blog-header">
                                                    <h4>{blog.title}</h4>
                                                    <small>{blog.createdAt.slice(0, 10)}</small>
                                                </div><hr />
                                                <h6 className='text-center'>Author: {blog.user.username}</h6>
                                                <p>{`${blog.description.slice(0, 200)}......`}</p>
                                                <Link to={`/get-blog/${blog._id}`}><button className='edit mx-auto d-block'>View <i className="fa-solid fa-arrow-right" style={{ color: "#ffffff" }} />
                                                </button></Link>
                                            </div>
                                            <Toaster
                                                position="top-center"
                                                reverseOrder={false}
                                            />
                                        </div>
                                    </div>
                                )))
                            )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default UserBlogs
