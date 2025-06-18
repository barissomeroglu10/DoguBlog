import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import AuthService from './AuthService';

class UserService {
  constructor() {
    this.usersCollection = 'users';
    this.followsCollection = 'follows';
    this.notificationsCollection = 'notifications';
  }

  // Get user profile by username
  async getUserProfile(username) {
    try {
      const userData = await AuthService.getUserByUsername(username);
      if (!userData) {
        throw new Error('User not found');
      }

      // Get additional profile data
      const profileData = {
        ...userData,
        isFollowing: false,
        mutualFollows: []
      };

      // Check if current user follows this user
      const currentUser = AuthService.getCurrentUser();
      if (currentUser && currentUser.uid !== userData.uid) {
        profileData.isFollowing = await this.isFollowing(currentUser.uid, userData.uid);
        profileData.mutualFollows = await this.getMutualFollows(currentUser.uid, userData.uid);
      }

      return {
        success: true,
        user: profileData
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      throw new Error('Failed to get user profile: ' + error.message);
    }
  }

  // Update user avatar
  async updateUserAvatar(imageFile) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      // Delete old avatar if exists
      const userData = await AuthService.getCurrentUserData();
      if (userData?.photoURL) {
        try {
          const oldImageRef = ref(storage, userData.photoURL);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn('Failed to delete old avatar:', error);
        }
      }

      // Upload new avatar
      const imageRef = ref(storage, `avatars/${currentUser.uid}/${Date.now()}`);
      const snapshot = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update user profile
      await AuthService.updateUserProfile({ photoURL: downloadURL });

      return {
        success: true,
        photoURL: downloadURL,
        message: 'Avatar updated successfully'
      };
    } catch (error) {
      console.error('Update avatar error:', error);
      throw new Error('Failed to update avatar: ' + error.message);
    }
  }

  // Follow user
  async followUser(targetUserId) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');
      
      if (currentUser.uid === targetUserId) {
        throw new Error('Cannot follow yourself');
      }

      // Check if already following
      if (await this.isFollowing(currentUser.uid, targetUserId)) {
        throw new Error('Already following this user');
      }

      const batch = writeBatch(db);

      // Create follow relationship
      const followRef = doc(db, this.followsCollection, `${currentUser.uid}_${targetUserId}`);
      batch.set(followRef, {
        followerId: currentUser.uid,
        followingId: targetUserId,
        createdAt: serverTimestamp()
      });

      // Update follower's following count
      const followerRef = doc(db, this.usersCollection, currentUser.uid);
      batch.update(followerRef, {
        'stats.followingCount': increment(1)
      });

      // Update following's followers count
      const followingRef = doc(db, this.usersCollection, targetUserId);
      batch.update(followingRef, {
        'stats.followersCount': increment(1)
      });

      await batch.commit();

      // Create notification
      await this.createNotification({
        userId: targetUserId,
        type: 'follow',
        message: 'started following you',
        actorId: currentUser.uid,
        metadata: {
          userId: currentUser.uid
        }
      });

      return {
        success: true,
        message: 'User followed successfully'
      };
    } catch (error) {
      console.error('Follow user error:', error);
      throw new Error('Failed to follow user: ' + error.message);
    }
  }

  // Unfollow user
  async unfollowUser(targetUserId) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      // Check if actually following
      if (!(await this.isFollowing(currentUser.uid, targetUserId))) {
        throw new Error('Not following this user');
      }

      const batch = writeBatch(db);

      // Remove follow relationship
      const followRef = doc(db, this.followsCollection, `${currentUser.uid}_${targetUserId}`);
      batch.delete(followRef);

      // Update follower's following count
      const followerRef = doc(db, this.usersCollection, currentUser.uid);
      batch.update(followerRef, {
        'stats.followingCount': increment(-1)
      });

      // Update following's followers count
      const followingRef = doc(db, this.usersCollection, targetUserId);
      batch.update(followingRef, {
        'stats.followersCount': increment(-1)
      });

      await batch.commit();

      return {
        success: true,
        message: 'User unfollowed successfully'
      };
    } catch (error) {
      console.error('Unfollow user error:', error);
      throw new Error('Failed to unfollow user: ' + error.message);
    }
  }

  // Get user followers
  async getUserFollowers(userId, options = {}) {
    try {
      const { limit: limitCount = 20, lastVisible = null } = options;

      let q = query(
        collection(db, this.followsCollection),
        where('followingId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      const followers = [];

      for (const doc of snapshot.docs) {
        const followData = doc.data();
        const followerDoc = await getDoc(doc(db, this.usersCollection, followData.followerId));
        
        if (followerDoc.exists()) {
          followers.push({
            id: followerDoc.id,
            ...followerDoc.data(),
            followedAt: followData.createdAt
          });
        }
      }

      return {
        success: true,
        followers: followers,
        lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: followers.length === limitCount
      };
    } catch (error) {
      console.error('Get followers error:', error);
      throw new Error('Failed to get followers: ' + error.message);
    }
  }

  // Get user following
  async getUserFollowing(userId, options = {}) {
    try {
      const { limit: limitCount = 20, lastVisible = null } = options;

      let q = query(
        collection(db, this.followsCollection),
        where('followerId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      const following = [];

      for (const doc of snapshot.docs) {
        const followData = doc.data();
        const followingDoc = await getDoc(doc(db, this.usersCollection, followData.followingId));
        
        if (followingDoc.exists()) {
          following.push({
            id: followingDoc.id,
            ...followingDoc.data(),
            followedAt: followData.createdAt
          });
        }
      }

      return {
        success: true,
        following: following,
        lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: following.length === limitCount
      };
    } catch (error) {
      console.error('Get following error:', error);
      throw new Error('Failed to get following: ' + error.message);
    }
  }

  // Search users
  async searchUsers(searchTerm, options = {}) {
    try {
      const { limit: limitCount = 10 } = options;

      // This is a simplified search - in production, you'd use Algolia or Elasticsearch
      const usersQuery = query(
        collection(db, this.usersCollection),
        orderBy('fullName'),
        limit(limitCount * 2)
      );

      const snapshot = await getDocs(usersQuery);
      const users = [];

      snapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        if (this.matchesUserSearchTerm(userData, searchTerm)) {
          users.push(userData);
        }
      });

      return {
        success: true,
        users: users.slice(0, limitCount),
        resultsCount: users.length
      };
    } catch (error) {
      console.error('Search users error:', error);
      throw new Error('Failed to search users: ' + error.message);
    }
  }

  // Get suggested users to follow
  async getSuggestedUsers(limit = 5) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return { success: true, users: [] };

      // Get users with high follower counts that current user doesn't follow
      const usersQuery = query(
        collection(db, this.usersCollection),
        where('uid', '!=', currentUser.uid),
        orderBy('uid'),
        orderBy('stats.followersCount', 'desc'),
        limit(limit * 3)
      );

      const snapshot = await getDocs(usersQuery);
      const suggestions = [];

      for (const doc of snapshot.docs) {
        const userData = { id: doc.id, ...doc.data() };
        
        // Check if not already following
        if (!(await this.isFollowing(currentUser.uid, userData.uid))) {
          suggestions.push(userData);
          if (suggestions.length >= limit) break;
        }
      }

      return {
        success: true,
        users: suggestions
      };
    } catch (error) {
      console.error('Get suggested users error:', error);
      throw new Error('Failed to get suggested users: ' + error.message);
    }
  }

  // Get user notifications
  async getUserNotifications(options = {}) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      const { limit: limitCount = 20, unreadOnly = false } = options;

      let q = collection(db, this.notificationsCollection);
      
      const conditions = [where('userId', '==', currentUser.uid)];
      
      if (unreadOnly) {
        conditions.push(where('read', '==', false));
      }

      q = query(q, ...conditions, orderBy('createdAt', 'desc'), limit(limitCount));

      const snapshot = await getDocs(q);
      const notifications = [];

      for (const doc of snapshot.docs) {
        const notificationData = { id: doc.id, ...doc.data() };
        
        // Get actor data if exists
        if (notificationData.actorId) {
          const actorDoc = await getDoc(doc(db, this.usersCollection, notificationData.actorId));
          if (actorDoc.exists()) {
            notificationData.actor = {
              uid: actorDoc.id,
              username: actorDoc.data().username,
              fullName: actorDoc.data().fullName,
              photoURL: actorDoc.data().photoURL || ''
            };
          }
        }
        
        notifications.push(notificationData);
      }

      return {
        success: true,
        notifications: notifications
      };
    } catch (error) {
      console.error('Get notifications error:', error);
      throw new Error('Failed to get notifications: ' + error.message);
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      await updateDoc(doc(db, this.notificationsCollection, notificationId), {
        read: true,
        readAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw new Error('Failed to mark notification as read: ' + error.message);
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      const q = query(
        collection(db, this.notificationsCollection),
        where('userId', '==', currentUser.uid),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          read: true,
          readAt: serverTimestamp()
        });
      });

      await batch.commit();

      return {
        success: true,
        message: 'All notifications marked as read'
      };
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw new Error('Failed to mark all notifications as read: ' + error.message);
    }
  }

  // Helper Methods

  // Check if user is following another user
  async isFollowing(followerId, followingId) {
    try {
      const followDoc = await getDoc(doc(db, this.followsCollection, `${followerId}_${followingId}`));
      return followDoc.exists();
    } catch (error) {
      console.error('Is following check error:', error);
      return false;
    }
  }

  // Get mutual follows between two users
  async getMutualFollows(userId1, userId2) {
    try {
      // Get users that userId1 follows
      const user1FollowingQuery = query(
        collection(db, this.followsCollection),
        where('followerId', '==', userId1)
      );
      const user1Following = await getDocs(user1FollowingQuery);
      const user1FollowingIds = user1Following.docs.map(doc => doc.data().followingId);

      // Get users that userId2 follows
      const user2FollowingQuery = query(
        collection(db, this.followsCollection),
        where('followerId', '==', userId2)
      );
      const user2Following = await getDocs(user2FollowingQuery);
      const user2FollowingIds = user2Following.docs.map(doc => doc.data().followingId);

      // Find intersection
      const mutualIds = user1FollowingIds.filter(id => user2FollowingIds.includes(id));

      // Get user data for mutual follows
      const mutualUsers = [];
      for (const userId of mutualIds.slice(0, 3)) { // Limit to 3
        const userDoc = await getDoc(doc(db, this.usersCollection, userId));
        if (userDoc.exists()) {
          mutualUsers.push({
            uid: userDoc.id,
            username: userDoc.data().username,
            fullName: userDoc.data().fullName,
            photoURL: userDoc.data().photoURL || ''
          });
        }
      }

      return mutualUsers;
    } catch (error) {
      console.error('Get mutual follows error:', error);
      return [];
    }
  }

  // Create notification
  async createNotification(notificationData) {
    try {
      const notification = {
        userId: notificationData.userId,
        type: notificationData.type, // follow, like, comment, mention
        message: notificationData.message,
        actorId: notificationData.actorId || null,
        metadata: notificationData.metadata || {},
        read: false,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, this.notificationsCollection), notification);
    } catch (error) {
      console.error('Create notification error:', error);
    }
  }

  // Check if user search term matches
  matchesUserSearchTerm(user, searchTerm) {
    const term = searchTerm.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term) ||
      user.bio?.toLowerCase().includes(term)
    );
  }

  // Get user's bookmarked posts
  async getUserBookmarks(options = {}) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      const { limit: limitCount = 10 } = options;

      const bookmarksQuery = query(
        collection(db, 'bookmarks'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(bookmarksQuery);
      const bookmarks = [];

      for (const doc of snapshot.docs) {
        const bookmarkData = doc.data();
        const postDoc = await getDoc(doc(db, 'posts', bookmarkData.postId));
        
        if (postDoc.exists()) {
          bookmarks.push({
            id: postDoc.id,
            ...postDoc.data(),
            bookmarkedAt: bookmarkData.createdAt
          });
        }
      }

      return {
        success: true,
        bookmarks: bookmarks
      };
    } catch (error) {
      console.error('Get user bookmarks error:', error);
      throw new Error('Failed to get bookmarks: ' + error.message);
    }
  }

  // Get user activity feed
  async getUserActivityFeed(options = {}) {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) throw new Error('User must be authenticated');

      const { limit: limitCount = 20 } = options;

      // Get users that current user follows
      const followingQuery = query(
        collection(db, this.followsCollection),
        where('followerId', '==', currentUser.uid)
      );
      const followingSnapshot = await getDocs(followingQuery);
      const followingIds = followingSnapshot.docs.map(doc => doc.data().followingId);
      
      // Include current user's own posts
      followingIds.push(currentUser.uid);

      if (followingIds.length === 0) {
        return { success: true, posts: [] };
      }

      // Get posts from followed users (limited by Firestore's 'in' operator limit of 10)
      const postsQuery = query(
        collection(db, 'posts'),
        where('author.uid', 'in', followingIds.slice(0, 10)),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const postsSnapshot = await getDocs(postsQuery);
      const posts = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        posts: posts
      };
    } catch (error) {
      console.error('Get user activity feed error:', error);
      throw new Error('Failed to get activity feed: ' + error.message);
    }
  }
}

// Export singleton instance
export default new UserService(); 