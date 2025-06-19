import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

class BackendService {
  // ===== KULLANICI İŞLEMLERİ =====
  
  // Kullanıcı profili oluşturma
  async createUserProfile(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, message: 'Profil başarıyla oluşturuldu' };
    } catch (error) {
      console.error('Profil oluşturma hatası:', error);
      throw error;
    }
  }

  // Kullanıcı profili güncelleme
  async updateUserProfile(userId, updates) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true, message: 'Profil başarıyla güncellendi' };
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      throw error;
    }
  }

  // Kullanıcı profili getirme
  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, data: userSnap.data() };
      } else {
        return { success: false, message: 'Kullanıcı bulunamadı' };
      }
    } catch (error) {
      console.error('Profil getirme hatası:', error);
      throw error;
    }
  }

  // ===== BLOG YAZISI İŞLEMLERİ =====

  // Blog yazısı oluşturma
  async createPost(postData) {
    try {
      const postsRef = collection(db, 'posts');
      const newPost = {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        views: 0,
        comments: []
      };
      
      const docRef = await addDoc(postsRef, newPost);
      return { 
        success: true, 
        message: 'Blog yazısı başarıyla oluşturuldu',
        postId: docRef.id 
      };
    } catch (error) {
      console.error('Blog yazısı oluşturma hatası:', error);
      throw error;
    }
  }

  // Blog yazısı güncelleme
  async updatePost(postId, updates) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return { success: true, message: 'Blog yazısı başarıyla güncellendi' };
    } catch (error) {
      console.error('Blog yazısı güncelleme hatası:', error);
      throw error;
    }
  }

  // Blog yazısı silme
  async deletePost(postId) {
    try {
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
      return { success: true, message: 'Blog yazısı başarıyla silindi' };
    } catch (error) {
      console.error('Blog yazısı silme hatası:', error);
      throw error;
    }
  }

  // Tüm blog yazılarını getirme (sayfalama ile)
  async getAllPosts(page = 1, limitCount = 10) {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: posts };
    } catch (error) {
      console.error('Blog yazıları getirme hatası:', error);
      throw error;
    }
  }

  // Kullanıcının blog yazılarını getirme
  async getUserPosts(userId) {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: posts };
    } catch (error) {
      console.error('Kullanıcı blog yazıları getirme hatası:', error);
      throw error;
    }
  }

  // Blog yazısı detayını getirme
  async getPostById(postId) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (postSnap.exists()) {
        // Görüntülenme sayısını artır
        await updateDoc(postRef, {
          views: increment(1)
        });
        
        return { 
          success: true, 
          data: { id: postSnap.id, ...postSnap.data() } 
        };
      } else {
        return { success: false, message: 'Blog yazısı bulunamadı' };
      }
    } catch (error) {
      console.error('Blog yazısı getirme hatası:', error);
      throw error;
    }
  }

  // ===== YORUM İŞLEMLERİ =====

  // Yorum ekleme
  async addComment(postId, commentData) {
    try {
      const commentsRef = collection(db, 'comments');
      const newComment = {
        ...commentData,
        postId,
        createdAt: serverTimestamp(),
        likes: 0
      };
      
      const docRef = await addDoc(commentsRef, newComment);
      
      // Blog yazısına yorum sayısını ekle
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(docRef.id)
      });
      
      return { 
        success: true, 
        message: 'Yorum başarıyla eklendi',
        commentId: docRef.id 
      };
    } catch (error) {
      console.error('Yorum ekleme hatası:', error);
      throw error;
    }
  }

  // Blog yazısının yorumlarını getirme
  async getPostComments(postId) {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const comments = [];
      
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: comments };
    } catch (error) {
      console.error('Yorumlar getirme hatası:', error);
      throw error;
    }
  }

  // ===== BEĞENİ İŞLEMLERİ =====

  // Blog yazısını beğenme/beğenmekten vazgeçme
  async toggleLike(postId, userId) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('Blog yazısı bulunamadı');
      }
      
      const postData = postSnap.data();
      const likes = postData.likes || [];
      const isLiked = likes.includes(userId);
      
      if (isLiked) {
        // Beğeniyi kaldır
        await updateDoc(postRef, {
          likes: arrayRemove(userId)
        });
        return { success: true, message: 'Beğeni kaldırıldı' };
      } else {
        // Beğeni ekle
        await updateDoc(postRef, {
          likes: arrayUnion(userId)
        });
        return { success: true, message: 'Beğeni eklendi' };
      }
    } catch (error) {
      console.error('Beğeni işlemi hatası:', error);
      throw error;
    }
  }

  // ===== DOSYA YÜKLEME İŞLEMLERİ =====

  // Profil resmi yükleme
  async uploadProfileImage(userId, file) {
    try {
      const storageRef = ref(storage, `profile-images/${userId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { 
        success: true, 
        url: downloadURL,
        message: 'Profil resmi başarıyla yüklendi' 
      };
    } catch (error) {
      console.error('Profil resmi yükleme hatası:', error);
      throw error;
    }
  }

  // Blog yazısı resmi yükleme
  async uploadPostImage(postId, file) {
    try {
      const storageRef = ref(storage, `post-images/${postId}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { 
        success: true, 
        url: downloadURL,
        message: 'Resim başarıyla yüklendi' 
      };
    } catch (error) {
      console.error('Blog resmi yükleme hatası:', error);
      throw error;
    }
  }

  // ===== ARAMA İŞLEMLERİ =====

  // Blog yazılarında arama
  async searchPosts(searchTerm) {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff'),
        orderBy('title'),
        limit(20)
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: posts };
    } catch (error) {
      console.error('Arama hatası:', error);
      throw error;
    }
  }

  // ===== İSTATİSTİK İŞLEMLERİ =====

  // Blog yazısı istatistikleri
  async getPostStats(postId) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (postSnap.exists()) {
        const postData = postSnap.data();
        return {
          success: true,
          data: {
            likes: postData.likes?.length || 0,
            views: postData.views || 0,
            comments: postData.comments?.length || 0
          }
        };
      } else {
        return { success: false, message: 'Blog yazısı bulunamadı' };
      }
    } catch (error) {
      console.error('İstatistik getirme hatası:', error);
      throw error;
    }
  }

  // Kullanıcı istatistikleri
  async getUserStats(userId) {
    try {
      const userPosts = await this.getUserPosts(userId);
      const totalPosts = userPosts.data.length;
      let totalViews = 0;
      let totalLikes = 0;
      
      userPosts.data.forEach(post => {
        totalViews += post.views || 0;
        totalLikes += post.likes?.length || 0;
      });
      
      return {
        success: true,
        data: {
          totalPosts,
          totalViews,
          totalLikes,
          averageViews: totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0
        }
      };
    } catch (error) {
      console.error('Kullanıcı istatistikleri hatası:', error);
      throw error;
    }
  }
}

// Singleton instance
const backendService = new BackendService();
export default backendService; 