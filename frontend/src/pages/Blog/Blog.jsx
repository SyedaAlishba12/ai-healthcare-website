import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Health Tips',
    'Disease Information',
    'Nutrition',
    'Mental Health',
    'Fitness',
    'Wellness',
  ];

  const fetchBlogs = async (category) => {
    try {
      setLoading(true);
      setError('');

      let url = 'http://localhost:5000/api/blogs';
      if (category && category !== 'All') {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not fetch blogs');
      }

      setBlogs(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load health blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-slate-500 mt-4 text-sm font-semibold">Loading health blogs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[70vh]">
      {/* Page Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-dark tracking-tight">
          Health & Wellness Blog
        </h1>
        <p className="mt-3 text-slate-500 leading-relaxed">
          Explore our latest articles on health tips, disease information, nutrition, and mental well-being to keep yourself informed and healthy.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeCategory === category
                ? 'bg-primary text-white shadow-md scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-lightBg hover:text-primary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 max-w-2xl mx-auto rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Blog Grid / Empty State */}
      {!error && blogs.length === 0 ? (
        <Card className="text-center max-w-2xl mx-auto py-14">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-dark">No Blogs Found</h3>
          <p className="text-slate-500 text-sm mt-2">
            There are no articles in this category yet. Please check back later.
          </p>
        </Card>
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {blogs.map((blog) => (
    <Link to={`/blog/${blog._id}`} key={blog._id} className="block">
      <Card className="p-0 overflow-hidden flex flex-col h-full group animate-fade-in hover:-translate-y-1 transition-all duration-300">
        {/* Blog Image */}
        <div className="overflow-hidden h-52 w-full">
          <img 
            src={blog.image || 'https://via.placeholder.com/400x300'} 
            alt={blog.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Card Content */}
        <div className="p-6 flex flex-col flex-grow">
          <span className="inline-block bg-lightBg text-primary text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">
            {blog.category}
          </span>
          
          <h3 className="text-lg font-bold text-dark mb-2 leading-snug">
            {blog.title}
          </h3>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">
            {blog.description}
          </p>

          {/* Author & Date */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {blog.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-dark">{blog.author}</p>
                <p className="text-xs text-slate-400">{formatDate(blog.publishedDate)}</p>
              </div>
            </div>
            <span className="text-xs text-primary font-bold group-hover:underline">Read More →</span>
          </div>
        </div>
      </Card>
    </Link>
  ))}
</div>
      )}
    </div>
  );
};

export default Blog;