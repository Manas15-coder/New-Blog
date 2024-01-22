import React, { useEffect, useState } from 'react';
import '../Home/Home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactTypingEffect from 'react-typing-effect';
import { useSelector } from 'react-redux';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(2);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  const sendRequest = async () => {
    try {
      const { data } = await axios.get(`https://new-blog-server.onrender.com/api/blog/all-blog?limit=${limit}`);
      if (data?.success) {
        setBlogs(data?.blogs);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    sendRequest();
  }, [limit]);

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 2);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const filteredBlogs = search.trim() === ' ' ? blogs : blogs.filter((blog) => {
    return (blog && (blog.title.toLowerCase().includes(search.toLowerCase()) || blog.description.toLowerCase().includes(search.toLowerCase())));
  });
  if (!filteredBlogs.length === 0) {
    return <h1 className='text-center'>No search Found</h1>;
  }

  return (
    <>
      <section id='banner'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              {isLoggedIn && (<h2 className={isLoggedIn ? "heading" : ""}>Hi, {localStorage.getItem("userName")}</h2>)}
              <h1 className={isLoggedIn ? " ": "heading"}>
                <ReactTypingEffect text={["Create, Write and Search for Blogs...."]} />
              </h1><br />
              <span className='search-input'>
                <input value={search} onChange={handleSearch} className='search' placeholder='Search Anything...'></input>
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id='blog-section'>
        <div className='container'>
          <div className='row'>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div className='col-md-4' key={index}>
                  <div className='blog-wrapper'>
                    <Skeleton height={200} />
                    <div className='blog-body'>
                      <Skeleton height={20} width={100} />
                      <Skeleton height={12} width={150} />
                      <Skeleton height={12} width={100} />
                      <Skeleton height={12} width={80} />
                      <Skeleton height={12} width={120} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredBlogs.map((blog) => (
                <div className='col-md-4' key={blog._id}>
                  <Link to={`/get-blog/${blog._id}`}>
                    <div className='blog-wrapper' id={blog._id} isUser={localStorage.getItem("userId") === blog?.user?._id}>
                      <img src={blog.image} alt='blog-img' className='blog-img image-fluid mx-auto d-block' /><br/>
                      <div className='blog-body'>
                        <div className="blog-header">
                          <h5>{blog.title}</h5>
                        </div>
                        <h6 className='text-center'>Author: {blog.user?.username}</h6>
                        <hr />
                        <small className='text-center mx-auto d-block'>Published On : {blog.createdAt.slice(0, 10)}</small>
                        <small>{`${blog.description.slice(0, 100)}......`}</small>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
