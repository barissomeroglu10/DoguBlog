import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostService from '../services/PostService';

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { userData } = useAuth();

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');

      const options = {
        limit: 20,
        status: 'published',
        orderByField: 'createdAt',
        orderDirection: 'desc'
      };

      if (selectedCategory !== 'all') {
        options.tag = selectedCategory;
      }

      const result = await PostService.getPosts(options);
      
      if (result.success && result.posts.length > 0) {
        // Set featured post (first post)
        setFeaturedPost(result.posts[0]);
        // Set remaining posts
        setPosts(result.posts.slice(1));
      } else {
        setPosts([]);
        setFeaturedPost(null);
      }
    } catch (error) {
      setError('Failed to load posts: ' + error.message);
      console.error('Load posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      const result = await PostService.searchPosts(searchTerm, {
        limit: 20,
        status: 'published'
      });

      if (result.success && result.posts.length > 0) {
        setFeaturedPost(result.posts[0]);
        setPosts(result.posts.slice(1));
      } else {
        setPosts([]);
        setFeaturedPost(null);
      }
    } catch (error) {
      setError('Search failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Teknoloji', label: 'Teknoloji' },
    { value: 'Bilim', label: 'Bilim' },
    { value: 'Sanat', label: 'Sanat' },
    { value: 'Spor', label: 'Spor' },
    { value: 'Politika', label: 'Politika' },
    { value: 'Ekonomi', label: 'Ekonomi' },
    { value: 'Sağlık', label: 'Sağlık' },
    { value: 'Eğitim', label: 'Eğitim' },
    { value: 'Genel', label: 'Genel' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/homepage" className="text-2xl font-bold text-gray-900">DoguBlog</Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search stories, writers, or topics..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation Links & Profile */}
            <div className="flex items-center space-x-6">
              <Link to="/createpost" className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Write
              </Link>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <Link to="/profile">
                  <img 
                    className="h-8 w-8 rounded-full cursor-pointer" 
                    src={userData?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                    alt="Profile" 
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Filter */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main Content Area */}
            <main className="lg:col-span-8">
              {/* Featured Article */}
              {featuredPost && (
                <div className="mb-8">
                  <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-200">
                    {featuredPost.imageUrls && featuredPost.imageUrls.length > 0 && (
                      <img 
                        src={featuredPost.imageUrls[0]} 
                        alt={featuredPost.title} 
                        className="w-full h-64 object-cover" 
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <img 
                          src={featuredPost.author.photoURL || "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1"} 
                          alt={featuredPost.author.fullName} 
                          className="h-8 w-8 rounded-full" 
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {featuredPost.author.fullName || featuredPost.author.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(featuredPost.createdAt)}
                          </p>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-indigo-600 cursor-pointer">
                        <Link to={`/post/${featuredPost.id}`}>{featuredPost.title}</Link>
                      </h2>
                      <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {featuredPost.tags && featuredPost.tags.slice(0, 2).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                            </svg>
                            {featuredPost.stats?.likes || 0}
                          </span>
                          <span>{featuredPost.readTime || '5'} min read</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* Blog Posts List */}
              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <article key={post.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-200">
                      <div className="flex items-center mb-3">
                        <img 
                          src={post.author.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1"} 
                          alt={post.author.fullName} 
                          className="h-8 w-8 rounded-full" 
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {post.author.fullName || post.author.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer">
                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                          </h3>
                          <p className="text-gray-600 mb-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                                <span 
                                  key={index}
                                  className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                                </svg>
                                {post.stats?.likes || 0}
                              </span>
                              <span>{post.readTime || '5'} min read</span>
                            </div>
                          </div>
                        </div>
                        {post.imageUrls && post.imageUrls.length > 0 && (
                          <div className="ml-6">
                            <img 
                              src={post.imageUrls[0]} 
                              alt={post.title} 
                              className="w-24 h-24 rounded-lg object-cover" 
                            />
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first post.'}
                  </p>
                  {!searchTerm && (
                    <div className="mt-6">
                      <Link
                        to="/createpost"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Write your first post
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24">
                {/* About Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About DoguBlog</h3>
                  <p className="text-gray-600 mb-4">
                    A platform for sharing knowledge, stories, and insights. Join our community of writers and readers.
                  </p>
                  <Link 
                    to="/createpost"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Start Writing
                  </Link>
                </div>

                {/* Popular Tags */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Teknoloji', 'Bilim', 'Sanat', 'Spor', 'Politika', 'Ekonomi'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedCategory(tag)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage; 