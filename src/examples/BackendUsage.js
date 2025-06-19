import backendService from '../services/BackendService';
import { auth } from '../firebase/config';

// ===== KULLANIM ÖRNEKLERİ =====

// 1. Kullanıcı profili oluşturma
export const createUserProfileExample = async (userData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı giriş yapmamış');
    
    const result = await backendService.createUserProfile(user.uid, {
      displayName: userData.displayName,
      email: user.email,
      bio: userData.bio,
      avatar: userData.avatar || null,
      website: userData.website || null,
      location: userData.location || null
    });
    
    console.log('Profil oluşturuldu:', result);
    return result;
  } catch (error) {
    console.error('Profil oluşturma hatası:', error);
    throw error;
  }
};

// 2. Blog yazısı oluşturma
export const createPostExample = async (postData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı giriş yapmamış');
    
    const result = await backendService.createPost({
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      authorId: user.uid,
      authorName: user.displayName || user.email,
      tags: postData.tags || [],
      category: postData.category || 'Genel',
      imageUrl: postData.imageUrl || null,
      isPublished: postData.isPublished || true
    });
    
    console.log('Blog yazısı oluşturuldu:', result);
    return result;
  } catch (error) {
    console.error('Blog yazısı oluşturma hatası:', error);
    throw error;
  }
};

// 3. Tüm blog yazılarını getirme
export const getAllPostsExample = async () => {
  try {
    const result = await backendService.getAllPosts(1, 10);
    console.log('Blog yazıları:', result.data);
    return result;
  } catch (error) {
    console.error('Blog yazıları getirme hatası:', error);
    throw error;
  }
};

// 4. Blog yazısı detayını getirme
export const getPostDetailExample = async (postId) => {
  try {
    const result = await backendService.getPostById(postId);
    console.log('Blog yazısı detayı:', result.data);
    return result;
  } catch (error) {
    console.error('Blog yazısı detayı getirme hatası:', error);
    throw error;
  }
};

// 5. Yorum ekleme
export const addCommentExample = async (postId, commentText) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı giriş yapmamış');
    
    const result = await backendService.addComment(postId, {
      text: commentText,
      authorId: user.uid,
      authorName: user.displayName || user.email,
      authorAvatar: user.photoURL || null
    });
    
    console.log('Yorum eklendi:', result);
    return result;
  } catch (error) {
    console.error('Yorum ekleme hatası:', error);
    throw error;
  }
};

// 6. Beğeni işlemi
export const toggleLikeExample = async (postId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı giriş yapmamış');
    
    const result = await backendService.toggleLike(postId, user.uid);
    console.log('Beğeni işlemi:', result);
    return result;
  } catch (error) {
    console.error('Beğeni işlemi hatası:', error);
    throw error;
  }
};

// 7. Profil resmi yükleme
export const uploadProfileImageExample = async (file) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı giriş yapmamış');
    
    const result = await backendService.uploadProfileImage(user.uid, file);
    console.log('Profil resmi yüklendi:', result);
    
    // Profili güncelle
    await backendService.updateUserProfile(user.uid, {
      avatar: result.url
    });
    
    return result;
  } catch (error) {
    console.error('Profil resmi yükleme hatası:', error);
    throw error;
  }
};

// 8. Blog yazısı arama
export const searchPostsExample = async (searchTerm) => {
  try {
    const result = await backendService.searchPosts(searchTerm);
    console.log('Arama sonuçları:', result.data);
    return result;
  } catch (error) {
    console.error('Arama hatası:', error);
    throw error;
  }
};

// 9. Kullanıcı istatistikleri
export const getUserStatsExample = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı giriş yapmamış');
    
    const result = await backendService.getUserStats(user.uid);
    console.log('Kullanıcı istatistikleri:', result.data);
    return result;
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    throw error;
  }
};

// 10. Blog yazısı güncelleme
export const updatePostExample = async (postId, updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Kullanıcı giriş yapmamış');
    
    const result = await backendService.updatePost(postId, updates);
    console.log('Blog yazısı güncellendi:', result);
    return result;
  } catch (error) {
    console.error('Blog yazısı güncelleme hatası:', error);
    throw error;
  }
};

// ===== REACT HOOK ÖRNEĞİ =====

import { useState, useEffect } from 'react';

export const usePosts = (page = 1, limit = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const result = await backendService.getAllPosts(page, limit);
        setPosts(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit]);

  return { posts, loading, error };
};

export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const result = await backendService.getUserProfile(userId);
        setProfile(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return { profile, loading, error };
}; 