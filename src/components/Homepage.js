import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/homepage" className="text-2xl font-bold text-gray-900">StellarHack</Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search stories, writers, or topics..."
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
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
                <Link to="/profile" className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:ring-indigo-600 transition duration-200">
                  <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content Area */}
          <main className="lg:col-span-8">
            {/* Featured Article */}
            <div className="mb-8">
              <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-200">
                <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3" alt="Featured" className="w-full h-64 object-cover" />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1" alt="Author" className="h-8 w-8 rounded-full" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                      <p className="text-sm text-gray-500">Dec 15, 2023</p>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-indigo-600 cursor-pointer">
                    <Link to="/postdetail">The Future of Web Development: What to Expect in 2024</Link>
                  </h2>
                  <p className="text-gray-600 mb-4">Exploring the latest trends and technologies that will shape the web development landscape in the coming year...</p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Technology</span>
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Web Dev</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                        </svg>
                        124
                      </span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Blog Posts List */}
            <div className="space-y-6">
              {/* Post 1 */}
              <article className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-200">
                <div className="flex items-center mb-3">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1" alt="Author" className="h-8 w-8 rounded-full" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
                    <p className="text-sm text-gray-500">Dec 14, 2023</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer">
                      <Link to="/postdetail">Building Scalable Applications with Microservices</Link>
                    </h3>
                    <p className="text-gray-600 mb-3">A comprehensive guide to designing and implementing microservices architecture for modern applications...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Architecture</span>
                        <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Backend</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                          </svg>
                          89
                        </span>
                        <span>8 min read</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3" alt="Post" className="w-24 h-24 rounded-lg object-cover" />
                  </div>
                </div>
              </article>

              {/* Post 2 */}
              <article className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-200">
                <div className="flex items-center mb-3">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1" alt="Author" className="h-8 w-8 rounded-full" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Maria Rodriguez</p>
                    <p className="text-sm text-gray-500">Dec 13, 2023</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer">
                      <Link to="/postdetail">The Art of Code Review: Best Practices for Development Teams</Link>
                    </h3>
                    <p className="text-gray-600 mb-3">Learn how to conduct effective code reviews that improve code quality and foster team collaboration...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Best Practices</span>
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">Team</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                          </svg>
                          156
                        </span>
                        <span>6 min read</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3" alt="Post" className="w-24 h-24 rounded-lg object-cover" />
                  </div>
                </div>
              </article>

              {/* Post 3 */}
              <article className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-200">
                <div className="flex items-center mb-3">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1" alt="Author" className="h-8 w-8 rounded-full" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">David Kim</p>
                    <p className="text-sm text-gray-500">Dec 12, 2023</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer">
                      <Link to="/postdetail">Understanding Machine Learning: A Beginner's Guide</Link>
                    </h3>
                    <p className="text-gray-600 mb-3">Demystifying machine learning concepts and algorithms for developers new to the field...</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Machine Learning</span>
                        <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Beginner</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                          </svg>
                          203
                        </span>
                        <span>12 min read</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3" alt="Post" className="w-24 h-24 rounded-lg object-cover" />
                  </div>
                </div>
              </article>
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200">
                Load More Stories
              </button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 mt-8 lg:mt-0">
            {/* Trending Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between text-gray-600 hover:text-indigo-600 transition duration-200">
                  <span>JavaScript</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">1.2k</span>
                </a>
                <a href="#" className="flex items-center justify-between text-gray-600 hover:text-indigo-600 transition duration-200">
                  <span>React</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">890</span>
                </a>
                <a href="#" className="flex items-center justify-between text-gray-600 hover:text-indigo-600 transition duration-200">
                  <span>Web Development</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">756</span>
                </a>
                <a href="#" className="flex items-center justify-between text-gray-600 hover:text-indigo-600 transition duration-200">
                  <span>Python</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">654</span>
                </a>
                <a href="#" className="flex items-center justify-between text-gray-600 hover:text-indigo-600 transition duration-200">
                  <span>Machine Learning</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">543</span>
                </a>
              </div>
            </div>

            {/* Featured Writers */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Writers</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1" alt="Writer" className="h-10 w-10 rounded-full" />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                    <p className="text-xs text-gray-500">Tech Lead @Google</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 transition duration-200">
                    Follow
                  </button>
                </div>
                <div className="flex items-center">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1" alt="Writer" className="h-10 w-10 rounded-full" />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
                    <p className="text-xs text-gray-500">Senior Developer</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 transition duration-200">
                    Follow
                  </button>
                </div>
                <div className="flex items-center">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1" alt="Writer" className="h-10 w-10 rounded-full" />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">Maria Rodriguez</p>
                    <p className="text-xs text-gray-500">UX Designer</p>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50 transition duration-200">
                    Follow
                  </button>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-indigo-100 text-sm mb-4">Get the latest stories delivered to your inbox.</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-medium hover:bg-gray-50 transition duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Homepage; 