import {React} from 'react'
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import CreateBlog from './components/CreateBlog/CreateBlog';
import SingleBlog from './components/SingleBlog/SingleBlog';
import UserBlogs from './components/UserBlogs/UserBlogs';
import BlogDetails from './components/Blog Details/BlogDetails';
import Footer from './components/Home/Footer';

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/create-blog' element={<CreateBlog/>}/>
      <Route path='/create-blog' element={<CreateBlog/>}/>
      <Route path='/get-blog/:id' element={<SingleBlog/>}/>
      <Route path='/myBlogs' element={<UserBlogs/>}/>
      <Route path='/blog-details/:id' element={<BlogDetails/>}/>
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
