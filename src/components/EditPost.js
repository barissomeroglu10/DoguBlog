import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PostService from '../services/PostService';

const EditPost = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: 'Genel',
    tags: [],
    allowComments: true,
    status: 'published',
    imageUrls: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    setMessage('');
    try {
      const result = await PostService.getPost(id);
      if (result.success) {
        const post = result.post;
        setForm({
          title: post.title,
          subtitle: post.excerpt,
          content: post.content,
          category: post.category || 'Genel',
          tags: post.tags || [],
          allowComments: post.allowComments !== false,
          status: post.status || 'published',
          imageUrls: post.imageUrls || []
        });
        setImagePreview(post.imageUrls && post.imageUrls[0] ? post.imageUrls[0] : '');
      } else {
        setMessage('Yazı bulunamadı.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Yazı yüklenemedi: ' + err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() && form.tags.length < 5) {
      e.preventDefault();
      const tagValue = e.target.value.trim();
      if (!form.tags.includes(tagValue)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tagValue] }));
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setMessageType('');
    try {
      let imageUrls = form.imageUrls;
      if (imageFile) {
        imageUrls = await PostService.uploadPostImages([imageFile], currentUser.uid);
      }
      const updateData = {
        title: form.title,
        content: form.content,
        excerpt: form.subtitle || form.content.substring(0, 200) + '...',
        category: form.category,
        tags: form.tags,
        allowComments: form.allowComments,
        status: form.status,
        imageUrls
      };
      await PostService.updatePost(id, updateData);
      setMessage('Yazı başarıyla güncellendi!');
      setMessageType('success');
      setTimeout(() => navigate(`/post/${id}`), 1200);
    } catch (err) {
      setMessage('Yazı güncellenemedi: ' + err.message);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12">
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Yazıyı Düzenle</h2>
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Başlık</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Alt Başlık</label>
          <input
            type="text"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">İçerik</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
            rows="8"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Kategori</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Etiketler</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-indigo-600 hover:text-indigo-800">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            onKeyPress={handleTagAdd}
            placeholder="Etiket ekle (Enter ile ekle)..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Görsel</label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img src={imagePreview} alt="Görsel" className="w-32 h-32 object-cover rounded-lg" />
            )}
            <button type="button" onClick={handleImageClick} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Görsel Yükle
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <input
            id="allowComments"
            name="allowComments"
            type="checkbox"
            checked={form.allowComments}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="allowComments" className="ml-3 text-sm text-gray-700">
            Yorumlara izin ver
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
};

export default EditPost; 