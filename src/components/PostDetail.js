import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostService from '../services/PostService';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const { id } = useParams();
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadPost();
      loadComments();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPost = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await PostService.getPost(id);
      
      if (result.success) {
        setPost(result.post);
        // Check if user has liked/bookmarked this post
        if (currentUser) {
          // You can implement these checks if needed
          // setLiked(await PostService.hasUserLiked(id));
          // setBookmarked(await PostService.hasUserBookmarked(id));
        }
      }
    } catch (error) {
      setError('Failed to load post: ' + error.message);
      console.error('Load post error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const result = await PostService.getComments(id, {
        limit: 50,
        orderByField: 'createdAt',
        orderDirection: 'desc'
      });
      
      if (result.success) {
        setComments(result.comments);
      }
    } catch (error) {
      console.error('Load comments error:', error);
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const result = await PostService.toggleLike(id);
      if (result.success) {
        setLiked(!liked);
        // Update post stats
        setPost(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            likes: liked ? prev.stats.likes - 1 : prev.stats.likes + 1
          }
        }));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleBookmark = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const result = await PostService.toggleBookmark(id);
      if (result.success) {
        setBookmarked(!bookmarked);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const result = await PostService.addComment(id, newComment);
      
      if (result.success) {
        setNewComment('');
        // Reload comments
        loadComments();
        // Update post stats
        setPost(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            comments: prev.stats.comments + 1
          }
        }));
      }
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return formatDate(timestamp);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <Link 
            to="/homepage"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/homepage" className="text-2xl font-bold text-gray-900">DoguBlog</Link>
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

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          {/* Author Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link to={`/profile/${post.author.username}`}>
                <img 
                  src={post.author.photoURL || "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1"} 
                  alt={post.author.fullName} 
                  className="h-12 w-12 rounded-full" 
                />
              </Link>
              <div className="ml-4">
                <Link to={`/profile/${post.author.username}`} className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                  {post.author.fullName || post.author.username}
                </Link>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime || '5'} min read</span>
                  <span className="mx-2">•</span>
                  <span>{post.stats?.views || 0} views</span>
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition duration-200">
              Follow
            </button>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="mb-8">
            <img 
              src={post.imageUrls[0]} 
              alt={post.title} 
              className="w-full h-80 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div 
            className="text-lg text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between py-8 border-t border-b border-gray-200 mb-8">
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition duration-200 ${
                liked ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span>{post.stats?.likes || 0}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-50 text-gray-600 transition duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-8 8a9.954 9.954 0 01-4.536-1.089l-5.335 1.344a1 1 0 01-1.242-1.242l1.344-5.335A9.954 9.954 0 013 12c0-4.418 4.418-8 8-8s8 3.582 8 8z"></path>
              </svg>
              <span>{post.stats?.comments || comments.length}</span>
            </button>
            
            <button 
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition duration-200 ${
                bookmarked ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-50 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
              <span>Bookmark</span>
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
        {post.allowComments && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>
            
            {/* Comment Form */}
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex items-start space-x-4">
                  <img 
                    src={userData?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1"} 
                    alt="Your avatar" 
                    className="h-10 w-10 rounded-full" 
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={submittingComment || !newComment.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Please log in to leave a comment.</p>
                <Link 
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Log In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <img 
                    src={comment.author.photoURL || "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1"} 
                    alt={comment.author.fullName} 
                    className="h-10 w-10 rounded-full" 
                  />
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.author.fullName || comment.author.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail; 