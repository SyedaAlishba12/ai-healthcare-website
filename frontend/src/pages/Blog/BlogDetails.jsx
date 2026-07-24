import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Could not fetch blog');
        }

        setBlog(result.data);
      } catch (err) {
        setError(err.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-slate-500 mt-4 text-sm font-semibold">Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-dark mb-2">Blog Not Found</h1>
        <p className="text-slate-500 mb-6">{error}</p>
        <Button variant="primary" onClick={() => navigate('/blog')}>
          Back to All Blogs
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-lightBg min-h-screen">
      {/* Hero Image Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-10">
          <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit">
            {blog.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author & Meta Info */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {blog.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-dark">{blog.author}</p>
              <p className="text-sm text-slate-500">{formatDate(blog.publishedDate)}</p>
            </div>
          </div>
          <span className="text-sm text-slate-400 hidden sm:block">{blog.readTime}</span>
        </div>

        {/* Short Description */}
        <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8 italic">
          {blog.description}
        </p>

        {/* Full Content */}
        <div className="text-slate-700 leading-relaxed space-y-6 text-base">
          {blog.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-12 rounded-2xl bg-blue-50 border border-blue-100 p-6">
          <h3 className="text-sm font-bold text-dark mb-2">Medical Disclaimer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            This article provides general educational information only. It does not diagnose diseases, prescribe medication, or replace a licensed clinical consultation. Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link to="/blog">
            <Button variant="outline">← Back to All Blogs</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;