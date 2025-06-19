import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  const searchResults = [
    {
      id: 1,
      type: 'post',
      title: 'The Future of Web Development: What to Expect in 2024',
      excerpt: 'Exploring the latest trends and technologies that will shape the web development landscape in the coming year...',
      author: 'Sarah Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1',
      date: 'Dec 15, 2023',
      readTime: '5 min read',
      likes: 124,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3',
      tags: ['Technology', 'Web Development']
    },
    {
      id: 2,
      type: 'post',
      title: 'Building Scalable Applications with Microservices',
      excerpt: 'A comprehensive guide to designing and implementing microservices architecture for modern applications...',
      author: 'Alex Johnson',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1',
      date: 'Dec 14, 2023',
      readTime: '8 min read',
      likes: 89,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3',
      tags: ['Architecture', 'Backend']
    },
    {
      id: 3,
      type: 'user',
      name: 'Maria Rodriguez',
      username: 'mariarodriguez',
      bio: 'UX Designer passionate about creating beautiful and functional user experiences.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1',
      followers: 1250,
      posts: 18
    },
    {
      id: 4,
      type: 'post',
      title: 'Understanding Machine Learning: A Beginner\'s Guide',
      excerpt: 'Demystifying machine learning concepts and algorithms for developers new to the field...',
      author: 'David Kim',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1',
      date: 'Dec 12, 2023',
      readTime: '12 min read',
      likes: 203,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3',
      tags: ['Machine Learning', 'Beginner']
    }
  ];

  const filteredResults = searchResults.filter(result => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'posts') return result.type === 'post';
    if (activeFilter === 'users') return result.type === 'user';
    return true;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/homepage" className="text-2xl font-bold text-gray-900">StellarHack</Link>
            </div>
            <div className="flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, writers, or topics..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </form>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/createpost" className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-200">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Write
              </Link>
              <div className="relative">
                <Link to="/profile" className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:ring-indigo-600 transition duration-200">
                  <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">
            {searchQuery ? `Showing results for "${searchQuery}"` : 'Search for stories, writers, or topics'}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Content Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Content Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="contentType" 
                      value="all"
                      checked={activeFilter === 'all'}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All ({searchResults.length})</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="contentType" 
                      value="posts"
                      checked={activeFilter === 'posts'}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Posts ({searchResults.filter(r => r.type === 'post').length})</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="contentType" 
                      value="users"
                      checked={activeFilter === 'users'}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">People ({searchResults.filter(r => r.type === 'user').length})</span>
                  </label>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-liked">Most Liked</option>
                </select>
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition duration-200">
                    Technology
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition duration-200">
                    Web Development
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition duration-200">
                    React
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition duration-200">
                    JavaScript
                  </button>
                  <button className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition duration-200">
                    Backend
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Date Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="dateRange" value="any" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Any time</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="dateRange" value="week" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Past week</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="dateRange" value="month" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Past month</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="dateRange" value="year" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                    <span className="ml-2 text-sm text-gray-700">Past year</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Search Results */}
          <main className="lg:col-span-9">
            <div className="space-y-6">
              {filteredResults.map((result) => (
                <div key={result.id}>
                  {result.type === 'post' ? (
                    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden">
                      <div className="md:flex">
                        <div className="md:flex-1 p-6">
                          <div className="flex items-center mb-3">
                            <img src={result.authorAvatar} alt={result.author} className="h-8 w-8 rounded-full" />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{result.author}</p>
                              <p className="text-sm text-gray-500">{result.date}</p>
                            </div>
                          </div>
                          <Link to="/postdetail" className="block group">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition duration-200">
                              {result.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {result.excerpt}
                            </p>
                          </Link>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              {result.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                                </svg>
                                {result.likes}
                              </span>
                              <span>{result.readTime}</span>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-48 md:flex-shrink-0">
                          <img 
                            src={result.image} 
                            alt={result.title}
                            className="h-48 w-full object-cover md:h-full"
                          />
                        </div>
                      </div>
                    </article>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={result.avatar} alt={result.name} className="h-16 w-16 rounded-full" />
                          <div className="ml-4">
                            <Link to="/profile" className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition duration-200">
                              {result.name}
                            </Link>
                            <p className="text-sm text-gray-500">@{result.username}</p>
                            <p className="text-gray-600 mt-1">{result.bio}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{result.followers} followers</span>
                              <span>{result.posts} posts</span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition duration-200">
                          Follow
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                Load More Results
              </button>
            </div>

            {/* No Results */}
            {filteredResults.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms or filters.
                </p>
                <div className="mt-6">
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Clear search
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Search; 