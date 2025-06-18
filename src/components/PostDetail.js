import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PostDetail = () => {
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1',
      content: 'Great article! Really helped me understand the concepts better.',
      date: '2 hours ago',
      likes: 5
    },
    {
      id: 2,
      author: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1',
      content: 'Thanks for sharing this. The examples were very practical.',
      date: '4 hours ago',
      likes: 3
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1',
        content: newComment,
        date: 'just now',
        likes: 0
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
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

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            The Future of Web Development: What to Expect in 2024
          </h1>
          
          {/* Author Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link to="/profile">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1" alt="Author" className="h-12 w-12 rounded-full" />
              </Link>
              <div className="ml-4">
                <Link to="/profile" className="text-lg font-semibold text-gray-900 hover:text-indigo-600">Sarah Chen</Link>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Dec 15, 2023</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition duration-200">
              Follow
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">Technology</span>
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">Web Development</span>
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">Frontend</span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <img 
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3" 
            alt="Featured" 
            className="w-full h-80 object-cover rounded-xl"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            The web development landscape is constantly evolving, and 2024 promises to bring exciting new changes that will reshape how we build and interact with web applications. From new frameworks to revolutionary development approaches, let's explore what's on the horizon.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Rise of Edge Computing</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Edge computing is moving from a buzzword to a practical reality. With services like Cloudflare Workers, Vercel Edge Functions, and Deno Deploy, developers can now run server-side code closer to their users than ever before. This shift is particularly important for performance-critical applications and global user bases.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Development Tools</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            GitHub Copilot was just the beginning. We're seeing a new generation of AI-powered development tools that can generate entire components, write tests, and even refactor legacy code. These tools are becoming more sophisticated and integrated into our daily workflows.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">The Evolution of React and Modern Frameworks</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            React Server Components are gaining traction, while frameworks like Next.js, Remix, and SvelteKit are pushing the boundaries of what's possible with modern web applications. The focus is shifting towards better performance, developer experience, and more intuitive APIs.
          </p>

          <blockquote className="border-l-4 border-indigo-500 pl-6 py-4 my-6 bg-gray-50 rounded-r-lg">
            <p className="text-lg text-gray-700 italic">
              "The future of web development isn't just about new technologies—it's about creating better experiences for both developers and users."
            </p>
          </blockquote>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">WebAssembly Goes Mainstream</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            WebAssembly (WASM) is finally finding its place in mainstream web development. From running complex calculations in the browser to porting desktop applications to the web, WASM is opening up new possibilities that were previously unimaginable.
          </p>

          <p className="text-gray-700 leading-relaxed">
            As we move forward into 2024, the key will be balancing innovation with practicality. The tools and technologies that succeed will be those that not only push the envelope but also solve real problems for developers and users alike.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between py-8 border-t border-b border-gray-200 mb-8">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setLiked(!liked)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition duration-200 ${
                liked ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>{liked ? '125' : '124'}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-50 text-gray-600 transition duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-8 8a9.954 9.954 0 01-4.536-1.089l-5.335 1.344a1 1 0 01-1.242-1.242l1.344-5.335A9.954 9.954 0 013 12c0-4.418 4.418-8 8-8s8 3.582 8 8z"></path>
              </svg>
              <span>{comments.length}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-50 text-gray-600 transition duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
              <span>Share</span>
            </button>
          </div>
          
          <button className="flex items-center space-x-2 px-6 py-2 bg-yellow-400 text-yellow-900 rounded-full hover:bg-yellow-500 transition duration-200 font-medium">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <span>Tip Author</span>
          </button>
        </div>

        {/* Comments Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex space-x-4">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1" alt="Your avatar" className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none resize-none"
                  rows="3"
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <img src={comment.avatar} alt={comment.author} className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center mt-2 space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600 transition duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-sm text-gray-500 hover:text-indigo-600 transition duration-200">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">More from Sarah Chen</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/postdetail" className="block group">
              <article className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  Understanding React Server Components
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  A deep dive into React's newest feature and how it changes the game...
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>Dec 10, 2023</span>
                  <span className="mx-2">•</span>
                  <span>7 min read</span>
                </div>
              </article>
            </Link>
            
            <Link to="/postdetail" className="block group">
              <article className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition duration-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  Building Performant APIs with Node.js
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Best practices for creating fast and scalable backend services...
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>Dec 8, 2023</span>
                  <span className="mx-2">•</span>
                  <span>10 min read</span>
                </div>
              </article>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostDetail; 