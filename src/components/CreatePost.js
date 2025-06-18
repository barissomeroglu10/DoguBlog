import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CreatePost = () => {
  const [tags, setTags] = useState([]);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/homepage" className="text-2xl font-bold text-gray-900">StellarHack</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-700 hover:text-gray-900 transition duration-200">
                Save Draft
              </button>
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200">
                Publish
              </button>
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Editor Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm min-h-screen">
          {/* Editor Header */}
          <div className="p-8 border-b border-gray-100">
            {/* Title Input */}
            <div className="mb-6">
              <input 
                type="text" 
                placeholder="Your story title..."
                className="w-full text-4xl font-bold text-gray-900 placeholder-gray-400 border-0 outline-none focus:ring-0 resize-none"
                style={{fontFamily: 'Inter, sans-serif'}}
              />
            </div>

            {/* Subtitle Input */}
            <div className="mb-6">
              <input 
                type="text" 
                placeholder="Write a compelling subtitle (optional)..."
                className="w-full text-xl text-gray-600 placeholder-gray-400 border-0 outline-none focus:ring-0 resize-none"
              />
            </div>

            {/* Author Info */}
            <div className="flex items-center mb-6">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1" alt="Author" className="h-10 w-10 rounded-full" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">David Kim</p>
                <p className="text-xs text-gray-500">Dec 15, 2023</p>
              </div>
            </div>

            {/* Featured Image Upload */}
            <div className="mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition duration-200 cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">Upload a featured image</span>
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className="px-8 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-2 0V5H7v10h1a1 1 0 110 2H6a1 1 0 01-1-1V4z" clipRule="evenodd"></path>
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200 font-bold">
                B
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200 italic">
                I
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="p-8">
            <div className="editor-content" style={{minHeight: '400px'}}>
              <div 
                contentEditable="true" 
                className="prose prose-lg max-w-none focus:outline-none text-gray-800 leading-relaxed"
                style={{minHeight: '400px', fontSize: '18px', lineHeight: '1.7'}}
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
                    defaultChecked
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
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableTips" className="ml-3 text-sm text-gray-700">
                    Enable tips for this story
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    id="socialShare" 
                    name="socialShare" 
                    type="checkbox" 
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="socialShare" className="ml-3 text-sm text-gray-700">
                    Allow social media sharing
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Publish Actions */}
          <div className="px-8 pb-8">
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                    Save as Draft
                  </button>
                  <button className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200">
                    Preview
                  </button>
                </div>
                <button className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200">
                  Publish Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 