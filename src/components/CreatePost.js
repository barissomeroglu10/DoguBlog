import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostService from '../services/PostService';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: 'Genel',
    allowComments: true,
    enableTips: false
  });
  const [tags, setTags] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [publishedPostId, setPublishedPostId] = useState(null);
  
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.textContent || ''
    }));
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() && tags.length < 5) {
      e.preventDefault();
      const tagValue = e.target.value.trim();
      if (!tags.includes(tagValue)) {
        setTags([...tags, tagValue]);
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size validation (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage('Image size must be less than 10MB');
        setMessageType('error');
        return;
      }

      // File type validation
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file');
        setMessageType('error');
        return;
      }

      setFeaturedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage('Title is required');
      setMessageType('error');
      return false;
    }
    if (!formData.content.trim()) {
      setMessage('Content is required');
      setMessageType('error');
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setMessage('');

      // Prepare post data
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.subtitle.trim() || formData.content.substring(0, 200) + '...',
        tags: tags,
        category: formData.category,
        allowComments: formData.allowComments,
        status: 'published',
        images: featuredImage ? [featuredImage] : []
      };

      // Create post
      const result = await PostService.createPost(postData);
      
      if (result.success) {
        setMessage('Post başarıyla paylaşıldı!');
        setMessageType('success');
        setPublishedPostId(result.postId);
        // Redirect to the new post after 1.5s
        setTimeout(() => {
          navigate(`/post/${result.postId}`);
        }, 1500);
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsLoading(true);
      setMessage('');

      const postData = {
        title: formData.title.trim() || 'Untitled Draft',
        content: formData.content.trim(),
        excerpt: formData.subtitle.trim() || formData.content.substring(0, 200) + '...',
        tags: tags,
        category: formData.category,
        allowComments: formData.allowComments,
        status: 'draft',
        images: featuredImage ? [featuredImage] : []
      };

      const result = await PostService.createPost(postData);
      
      if (result.success) {
        setMessage('Draft saved successfully!');
        setMessageType('success');
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/homepage" className="text-2xl font-bold text-gray-900">DoguBlog</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition duration-200 disabled:opacity-50"
              >
                Save Draft
              </button>
              <button 
                onClick={handlePublish}
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  'Publish'
                )}
              </button>
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <img 
                    className="h-8 w-8 rounded-full" 
                    src={userData?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                    alt="Profile" 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Status Message */}
      {message && (
        <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4`}>
          <div className={`p-3 rounded-lg text-sm ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
            {messageType === 'success' && publishedPostId && (
              <div className="mt-2">
                <button
                  onClick={() => navigate(`/post/${publishedPostId}`)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 mt-2"
                >
                  Yazıyı Görüntüle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Editor Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm min-h-screen">
          {/* Editor Header */}
          <div className="p-8 border-b border-gray-100">
            {/* Title Input */}
            <div className="mb-6">
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Your story title..."
                className="w-full text-4xl font-bold text-gray-900 placeholder-gray-400 border-0 outline-none focus:ring-0 resize-none"
                style={{fontFamily: 'Inter, sans-serif'}}
              />
            </div>

            {/* Subtitle Input */}
            <div className="mb-6">
              <input 
                type="text" 
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Write a compelling subtitle (optional)..."
                className="w-full text-xl text-gray-600 placeholder-gray-400 border-0 outline-none focus:ring-0 resize-none"
              />
            </div>

            {/* Author Info */}
            <div className="flex items-center mb-6">
              <img 
                src={userData?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1"} 
                alt="Author" 
                className="h-10 w-10 rounded-full" 
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {userData?.fullName || userData?.displayName || currentUser?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Genel">Genel</option>
                <option value="Teknoloji">Teknoloji</option>
                <option value="Bilim">Bilim</option>
                <option value="Sanat">Sanat</option>
                <option value="Spor">Spor</option>
                <option value="Politika">Politika</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="Sağlık">Sağlık</option>
                <option value="Eğitim">Eğitim</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            {/* Featured Image Upload */}
            <div className="mb-6">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Featured" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setFeaturedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ) : (
                <div 
                  onClick={handleImageClick}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition duration-200 cursor-pointer"
                >
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                      <span className="font-medium text-indigo-600 hover:text-indigo-500">Upload a featured image</span>
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
              </div>
              )}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="p-8">
            <div className="editor-content" style={{minHeight: '400px'}}>
              <div 
                ref={contentRef}
                contentEditable="true" 
                className="prose prose-lg max-w-none focus:outline-none text-gray-800 leading-relaxed"
                style={{minHeight: '400px', fontSize: '18px', lineHeight: '1.7'}}
                onInput={handleContentChange}
                data-placeholder="Start writing your story..."
              >
                <p className="text-gray-400">Start writing your story...</p>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="px-8 pb-8">
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  onKeyPress={handleTagAdd}
                  placeholder="Add tags (press Enter to add)..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 outline-none"
                />
                <p className="text-sm text-gray-500 mt-2">Add up to 5 tags to help readers discover your story</p>
              </div>
            </div>
          </div>

          {/* Publishing Options */}
          <div className="px-8 pb-8">
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing Options</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input 
                    id="allowComments" 
                    name="allowComments" 
                    type="checkbox" 
                    checked={formData.allowComments}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowComments" className="ml-3 text-sm text-gray-700">
                    Allow comments on this story
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="enableTips" 
                    name="enableTips" 
                    type="checkbox" 
                    checked={formData.enableTips}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableTips" className="ml-3 text-sm text-gray-700">
                    Enable reader tips
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 