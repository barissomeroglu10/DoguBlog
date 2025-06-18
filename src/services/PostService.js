import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import AuthService from './AuthService';

class PostService {
  constructor() {
    this.postsCollection = 'posts';
    this.commentsCollection = 'comments';
    this.likesCollection = 'likes';
    this.bookmarksCollection = 'bookmarks';
    this.tagsCollection = 'tags';
  }

  // Create new post
  async createPost(postData) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      const userData = await AuthService.getCurrentUserData();
      if (!userData) throw new Error('User data not found');

      // Upload images if any
      let imageUrls = [];
      if (postData.images && postData.images.length > 0) {
        imageUrls = await this.uploadPostImages(postData.images, currentUser.uid);
      }

      // Process tags
      const tags = this.extractTags(postData.tags || []);
      await this.updateTagsCollection(tags);

      // Create post document
      const post = {
        title: postData.title,
        content: postData.content,
        excerpt: this.generateExcerpt(postData.content),
        author: {
          uid: userData.uid,
          username: userData.username,
          fullName: userData.fullName,
          photoURL: userData.photoURL || ''
        },
        tags: tags,
        imageUrls: imageUrls,
        status: postData.status || 'published', // draft, published, archived
        readTime: this.calculateReadTime(postData.content),
        stats: {
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          bookmarks: 0
        },
        seo: {
          metaTitle: postData.title,
          metaDescription: this.generateExcerpt(postData.content, 160),
          slug: await this.generateUniqueSlug(postData.title)
        },
        visibility: postData.visibility || 'public', // public, private, unlisted
        allowComments: postData.allowComments !== false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        scheduledAt: postData.scheduledAt || null,
        isPromoted: false,
        moderationStatus: 'approved' // pending, approved, rejected
      };

      // Add post to Firestore
      const docRef = await addDoc(collection(db, this.postsCollection), post);

      // Update user's post count
      await this.updateUserPostCount(currentUser.uid, 1);

      // Return post with ID
      return {
        success: true,
        postId: docRef.id,
        post: { id: docRef.id, ...post },
        message: 'Post created successfully'
      };
    } catch (error) {
      console.error('Create post error:', error);
      throw new Error('Failed to create post: ' + error.message);
    }
  }

  // Get post by ID
  async getPost(postId) {
    try {
      const postDoc = await getDoc(doc(db, this.postsCollection, postId));
      
      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const postData = { id: postDoc.id, ...postDoc.data() };

      // Increment view count
      await this.incrementPostViews(postId);

      // Get author details
      const authorData = await AuthService.getUserByUsername(postData.author.username);
      if (authorData) {
        postData.author = {
          ...postData.author,
          bio: authorData.bio,
          stats: authorData.stats
        };
      }

      return {
        success: true,
        post: postData
      };
    } catch (error) {
      console.error('Get post error:', error);
      throw new Error('Failed to get post: ' + error.message);
    }
  }

  // Get posts with pagination and filtering
  async getPosts(options = {}) {
    try {
      const {
        limit: limitCount = 10,
        lastVisible = null,
        author = null,
        tag = null,
        status = 'published',
        orderByField = 'createdAt',
        orderDirection = 'desc',
        searchTerm = null
      } = options;

      let q = collection(db, this.postsCollection);

      // Apply filters
      const conditions = [where('status', '==', status)];
      
      if (author) {
        conditions.push(where('author.username', '==', author));
      }
      
      if (tag) {
        conditions.push(where('tags', 'array-contains', tag));
      }

      // Build query
      q = query(q, ...conditions, orderBy(orderByField, orderDirection), limit(limitCount));

      // Add pagination
      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      const posts = [];
      let lastDoc = null;

      snapshot.forEach((doc) => {
        const postData = { id: doc.id, ...doc.data() };
        
        // Filter by search term if provided
        if (!searchTerm || this.matchesSearchTerm(postData, searchTerm)) {
          posts.push(postData);
        }
        
        lastDoc = doc;
      });

      return {
        success: true,
        posts: posts,
        lastVisible: lastDoc,
        hasMore: posts.length === limitCount
      };
    } catch (error) {
      console.error('Get posts error:', error);
      throw new Error('Failed to get posts: ' + error.message);
    }
  }

  // Update post
  async updatePost(postId, updateData) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      // Check if user owns the post
      const postDoc = await getDoc(doc(db, this.postsCollection, postId));
      if (!postDoc.exists()) throw new Error('Post not found');
      
      const postData = postDoc.data();
      if (postData.author.uid !== currentUser.uid) {
        throw new Error('Unauthorized to update this post');
      }

      // Handle image updates
      let imageUrls = postData.imageUrls || [];
      if (updateData.images) {
        // Delete old images if replacing
        if (updateData.replaceImages) {
          await this.deletePostImages(imageUrls);
          imageUrls = await this.uploadPostImages(updateData.images, currentUser.uid);
        } else {
          // Add new images
          const newImageUrls = await this.uploadPostImages(updateData.images, currentUser.uid);
          imageUrls = [...imageUrls, ...newImageUrls];
        }
      }

      // Process tags if updated
      let tags = postData.tags;
      if (updateData.tags) {
        tags = this.extractTags(updateData.tags);
        await this.updateTagsCollection(tags);
      }

      // Prepare update object
      const updates = {
        ...updateData,
        tags: tags,
        imageUrls: imageUrls,
        updatedAt: serverTimestamp()
      };

      // Remove non-updatable fields
      delete updates.images;
      delete updates.replaceImages;

      // Update post
      await updateDoc(doc(db, this.postsCollection, postId), updates);

      return {
        success: true,
        message: 'Post updated successfully'
      };
    } catch (error) {
      console.error('Update post error:', error);
      throw new Error('Failed to update post: ' + error.message);
    }
  }

  // Delete post
  async deletePost(postId) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      // Check if user owns the post
      const postDoc = await getDoc(doc(db, this.postsCollection, postId));
      if (!postDoc.exists()) throw new Error('Post not found');
      
      const postData = postDoc.data();
      if (postData.author.uid !== currentUser.uid) {
        throw new Error('Unauthorized to delete this post');
      }

      // Delete associated images
      if (postData.imageUrls && postData.imageUrls.length > 0) {
        await this.deletePostImages(postData.imageUrls);
      }

      // Delete post document
      await deleteDoc(doc(db, this.postsCollection, postId));

      // Update user's post count
      await this.updateUserPostCount(currentUser.uid, -1);

      // Delete associated comments and likes (batch operation)
      await this.deletePostAssociatedData(postId);

      return {
        success: true,
        message: 'Post deleted successfully'
      };
    } catch (error) {
      console.error('Delete post error:', error);
      throw new Error('Failed to delete post: ' + error.message);
    }
  }

  // Like/Unlike post
  async toggleLike(postId) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      const likeRef = doc(db, this.likesCollection, `${postId}_${currentUser.uid}`);
      const likeDoc = await getDoc(likeRef);
      const postRef = doc(db, this.postsCollection, postId);

      const batch = writeBatch(db);

      if (likeDoc.exists()) {
        // Unlike: Remove like document and decrement count
        batch.delete(likeRef);
        batch.update(postRef, {
          'stats.likes': increment(-1)
        });
        
        await batch.commit();
        return { success: true, liked: false, message: 'Post unliked' };
      } else {
        // Like: Create like document and increment count
        batch.set(likeRef, {
          postId: postId,
          userId: currentUser.uid,
          createdAt: serverTimestamp()
        });
        batch.update(postRef, {
          'stats.likes': increment(1)
        });
        
        await batch.commit();
        return { success: true, liked: true, message: 'Post liked' };
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      throw new Error('Failed to toggle like: ' + error.message);
    }
  }

  // Bookmark/Unbookmark post
  async toggleBookmark(postId) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      const bookmarkRef = doc(db, this.bookmarksCollection, `${postId}_${currentUser.uid}`);
      const bookmarkDoc = await getDoc(bookmarkRef);
      const postRef = doc(db, this.postsCollection, postId);

      const batch = writeBatch(db);

      if (bookmarkDoc.exists()) {
        // Remove bookmark
        batch.delete(bookmarkRef);
        batch.update(postRef, {
          'stats.bookmarks': increment(-1)
        });
        
        await batch.commit();
        return { success: true, bookmarked: false, message: 'Bookmark removed' };
      } else {
        // Add bookmark
        batch.set(bookmarkRef, {
          postId: postId,
          userId: currentUser.uid,
          createdAt: serverTimestamp()
        });
        batch.update(postRef, {
          'stats.bookmarks': increment(1)
        });
        
        await batch.commit();
        return { success: true, bookmarked: true, message: 'Post bookmarked' };
      }
    } catch (error) {
      console.error('Toggle bookmark error:', error);
      throw new Error('Failed to toggle bookmark: ' + error.message);
    }
  }

  // Add comment to post
  async addComment(postId, commentText, parentId = null) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      const userData = await AuthService.getCurrentUserData();
      if (!userData) throw new Error('User data not found');

      const comment = {
        postId: postId,
        parentId: parentId,
        content: commentText,
        author: {
          uid: userData.uid,
          username: userData.username,
          fullName: userData.fullName,
          photoURL: userData.photoURL || ''
        },
        stats: {
          likes: 0,
          replies: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isEdited: false
      };

      // Add comment
      const docRef = await addDoc(collection(db, this.commentsCollection), comment);

      // Update post comment count
      await updateDoc(doc(db, this.postsCollection, postId), {
        'stats.comments': increment(1)
      });

      // If this is a reply, update parent comment reply count
      if (parentId) {
        await updateDoc(doc(db, this.commentsCollection, parentId), {
          'stats.replies': increment(1)
        });
      }

      return {
        success: true,
        commentId: docRef.id,
        comment: { id: docRef.id, ...comment },
        message: 'Comment added successfully'
      };
    } catch (error) {
      console.error('Add comment error:', error);
      throw new Error('Failed to add comment: ' + error.message);
    }
  }

  // Get comments for post
  async getComments(postId, options = {}) {
    try {
      const {
        limit: limitCount = 20,
        orderByField = 'createdAt',
        orderDirection = 'desc'
      } = options;

      const q = query(
        collection(db, this.commentsCollection),
        where('postId', '==', postId),
        where('parentId', '==', null), // Only top-level comments
        orderBy(orderByField, orderDirection),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      const comments = [];

      for (const doc of snapshot.docs) {
        const commentData = { id: doc.id, ...doc.data() };
        
        // Get replies for this comment
        const repliesQuery = query(
          collection(db, this.commentsCollection),
          where('parentId', '==', doc.id),
          orderBy('createdAt', 'asc')
        );
        
        const repliesSnapshot = await getDocs(repliesQuery);
        commentData.replies = repliesSnapshot.docs.map(replyDoc => ({
          id: replyDoc.id,
          ...replyDoc.data()
        }));

        comments.push(commentData);
      }

      return {
        success: true,
        comments: comments
      };
    } catch (error) {
      console.error('Get comments error:', error);
      throw new Error('Failed to get comments: ' + error.message);
    }
  }

  // Get trending tags
  async getTrendingTags(limit = 10) {
    try {
      const q = query(
        collection(db, this.tagsCollection),
        orderBy('postCount', 'desc'),
        orderBy('lastUsed', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      const tags = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        tags: tags
      };
    } catch (error) {
      console.error('Get trending tags error:', error);
      throw new Error('Failed to get trending tags: ' + error.message);
    }
  }

  // Search posts
  async searchPosts(searchTerm, options = {}) {
    try {
      const {
        limit: limitCount = 10,
        tags = [],
        author = null,
        dateRange = null
      } = options;

      // This is a simplified search - in production, you'd use Algolia or Elasticsearch
      let q = collection(db, this.postsCollection);
      
      const conditions = [where('status', '==', 'published')];
      
      if (author) {
        conditions.push(where('author.username', '==', author));
      }
      
      if (tags.length > 0) {
        conditions.push(where('tags', 'array-contains-any', tags));
      }

      q = query(q, ...conditions, orderBy('createdAt', 'desc'), limit(limitCount * 2));

      const snapshot = await getDocs(q);
      const posts = [];

      snapshot.forEach((doc) => {
        const postData = { id: doc.id, ...doc.data() };
        if (this.matchesSearchTerm(postData, searchTerm)) {
          posts.push(postData);
        }
      });

      return {
        success: true,
        posts: posts.slice(0, limitCount),
        resultsCount: posts.length
      };
    } catch (error) {
      console.error('Search posts error:', error);
      throw new Error('Failed to search posts: ' + error.message);
    }
  }

  // Helper Methods

  // Upload post images
  async uploadPostImages(images, userId) {
    const uploadPromises = images.map(async (image, index) => {
      const imageRef = ref(storage, `posts/${userId}/${Date.now()}_${index}`);
      const snapshot = await uploadBytes(imageRef, image);
      return await getDownloadURL(snapshot.ref);
    });

    return await Promise.all(uploadPromises);
  }

  // Delete post images
  async deletePostImages(imageUrls) {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Failed to delete image:', url, error);
      }
    });

    await Promise.all(deletePromises);
  }

  // Extract and clean tags
  extractTags(tags) {
    return tags
      .map(tag => tag.toLowerCase().trim())
      .filter(tag => tag.length > 0 && tag.length <= 50)
      .slice(0, 10); // Max 10 tags
  }

  // Update tags collection
  async updateTagsCollection(tags) {
    const batch = writeBatch(db);
    
    for (const tag of tags) {
      const tagRef = doc(db, this.tagsCollection, tag);
      const tagDoc = await getDoc(tagRef);
      
      if (tagDoc.exists()) {
        batch.update(tagRef, {
          postCount: increment(1),
          lastUsed: serverTimestamp()
        });
      } else {
        batch.set(tagRef, {
          name: tag,
          postCount: 1,
          createdAt: serverTimestamp(),
          lastUsed: serverTimestamp()
        });
      }
    }
    
    await batch.commit();
  }

  // Generate excerpt
  generateExcerpt(content, maxLength = 200) {
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  }

  // Calculate read time
  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, readTime); // Minimum 1 minute
  }

  // Generate unique slug
  async generateUniqueSlug(title) {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.slugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  // Check if slug exists
  async slugExists(slug) {
    const q = query(
      collection(db, this.postsCollection),
      where('seo.slug', '==', slug),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  // Increment post views
  async incrementPostViews(postId) {
    try {
      await updateDoc(doc(db, this.postsCollection, postId), {
        'stats.views': increment(1)
      });
    } catch (error) {
      console.warn('Failed to increment views:', error);
    }
  }

  // Update user post count
  async updateUserPostCount(userId, increment_value) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        'stats.postsCount': increment(increment_value)
      });
    } catch (error) {
      console.warn('Failed to update user post count:', error);
    }
  }

  // Delete post associated data
  async deletePostAssociatedData(postId) {
    const batch = writeBatch(db);
    
    // Delete comments
    const commentsQuery = query(
      collection(db, this.commentsCollection),
      where('postId', '==', postId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    commentsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete likes
    const likesQuery = query(
      collection(db, this.likesCollection),
      where('postId', '==', postId)
    );
    const likesSnapshot = await getDocs(likesQuery);
    likesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete bookmarks
    const bookmarksQuery = query(
      collection(db, this.bookmarksCollection),
      where('postId', '==', postId)
    );
    const bookmarksSnapshot = await getDocs(bookmarksQuery);
    bookmarksSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  // Check if content matches search term
  matchesSearchTerm(post, searchTerm) {
    const term = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.author.fullName.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }
}

// Export singleton instance
export default new PostService(); 