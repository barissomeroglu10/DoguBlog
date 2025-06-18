import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const posts = [
    {
      id: 1,
      title: 'The Future of Web Development: What to Expect in 2024',
      excerpt: 'Exploring the latest trends and technologies that will shape the web development landscape...',
      date: 'Dec 15, 2023',
      readTime: '5 min read',
      likes: 124,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3'
    },
    {
      id: 2,
      title: 'Understanding React Server Components',
      excerpt: 'A deep dive into React\'s newest feature and how it changes the game for modern applications...',
      date: 'Dec 10, 2023',
      readTime: '7 min read',
      likes: 89,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3'
    },
    {
      id: 3,
      title: 'Building Performant APIs with Node.js',
      excerpt: 'Best practices for creating fast and scalable backend services that can handle millions of requests...',
      date: 'Dec 8, 2023',
      readTime: '10 min read',
      likes: 156,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3'
    }
  ];

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

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1" 
                alt="Sarah Chen" 
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Sarah Chen</h1>
                  <p className="text-lg text-gray-600 mt-1">Tech Lead @Google</p>
                  <p className="text-gray-500 mt-2">Joined December 2022</p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
                      isFollowing 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <Link 
                    to="/editprofile" 
                    className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-200"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <p className="text-gray-700 leading-relaxed">
                  Passionate about building scalable web applications and exploring cutting-edge technologies. 
                  I love sharing my knowledge through writing and helping developers grow in their careers. 
                  When I'm not coding, you can find me hiking or experimenting with new coffee brewing methods.
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 mt-6 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">{posts.length}</span>
                  <span className="text-gray-500">Posts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">1.2k</span>
                  <span className="text-gray-500">Followers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">89</span>
                  <span className="text-gray-500">Following</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-gray-900">369</span>
                  <span className="text-gray-500">Total Likes</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                activeTab === 'posts' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Published Posts ({posts.length})
            </button>
            <button 
              onClick={() => setActiveTab('drafts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                activeTab === 'drafts' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Drafts (2)
            </button>
            <button 
              onClick={() => setActiveTab('likes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition duration-200 ${
                activeTab === 'likes' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Liked Posts (45)
            </button>
          </nav>
        </div>

        {/* Posts Grid */}
        {activeTab === 'posts' && (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1" alt="Sarah Chen" className="h-8 w-8 rounded-full" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                          <p className="text-sm text-gray-500">{post.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <Link to="/postdetail" className="block group">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition duration-200">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </Link>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                          </svg>
                          {post.likes}
                        </span>
                        <span>{post.readTime}</span>
                      </div>
                      <span className="text-green-600 font-medium">Published</span>
                    </div>
                  </div>
                  <div className="md:w-48 md:flex-shrink-0">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="h-48 w-full object-cover md:h-full"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No drafts</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new story.</p>
            <div className="mt-6">
              <Link 
                to="/createpost" 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Write Story
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No liked posts</h3>
            <p className="mt-1 text-sm text-gray-500">Stories you like will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 