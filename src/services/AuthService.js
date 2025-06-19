import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    this.initializeAuthListener();
  }

  // Initialize auth state listener
  initializeAuthListener() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        await this.updateUserActivity();
      }
      this.authStateListeners.forEach(callback => callback(user));
    });
  }

  // Register new user
  async register(userData) {
    try {
      const { email, password, fullName, username } = userData;
      
      // Check if username is available
      const isUsernameAvailable = await this.checkUsernameAvailability(username);
      if (!isUsernameAvailable) {
        throw new Error('Username is already taken');
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: fullName
      });

      // Create user document in Firestore
      await this.createUserDocument(user, {
        fullName,
        username,
        email,
        bio: '',
        website: '',
        location: '',
        socialLinks: {
          twitter: '',
          linkedin: '',
          github: ''
        },
        preferences: {
          emailNotifications: true,
          profileVisibility: true,
          showActivity: false
        },
        stats: {
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          likesReceived: 0
        },
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
        isVerified: false,
        role: 'user'
      });

      // Send email verification
      await sendEmailVerification(user);

      return {
        success: true,
        user: user,
        message: 'Account created successfully. Please check your email for verification.'
      };
    } catch (error) {
      console.error('Registration error:', error, error.code, error.message);
      throw new Error(this.getErrorMessage(error.code) || error.message || 'An unexpected error occurred');
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await this.updateUserActivity();
      
      return {
        success: true,
        user: userCredential.user,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Google Sign In
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if this is a new user
      const userDoc = await this.getUserDocument(user.uid);
      if (!userDoc.exists()) {
        // Create user document for new Google user
        await this.createUserDocument(user, {
          fullName: user.displayName || '',
          username: await this.generateUniqueUsername(user.displayName || user.email),
          email: user.email,
          bio: '',
          website: '',
          location: '',
          socialLinks: {
            twitter: '',
            linkedin: '',
            github: ''
          },
          preferences: {
            emailNotifications: true,
            profileVisibility: true,
            showActivity: false
          },
          stats: {
            postsCount: 0,
            followersCount: 0,
            followingCount: 0,
            likesReceived: 0
          },
          createdAt: serverTimestamp(),
          lastActivity: serverTimestamp(),
          isVerified: user.emailVerified,
          role: 'user'
        });
      } else {
        await this.updateUserActivity();
      }

      return {
        success: true,
        user: user,
        message: 'Google login successful'
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user password
  async updateUserPassword(currentPassword, newPassword) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Password update error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user data
  async getCurrentUserData() {
    try {
      if (!this.currentUser) return null;
      
      const userDoc = await this.getUserDocument(this.currentUser.uid);
      if (userDoc.exists()) {
        return {
          uid: this.currentUser.uid,
          ...userDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(updates) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Update Firebase Auth profile if needed
      if (updates.fullName && updates.fullName !== user.displayName) {
        await updateProfile(user, {
          displayName: updates.fullName
        });
      }

      // Update Firestore document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Check username availability
  async checkUsernameAvailability(username) {
    try {
      const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
      return !usernameDoc.exists();
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  }

  // Generate unique username
  async generateUniqueUsername(baseName) {
    let username = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let counter = 1;
    
    while (!(await this.checkUsernameAvailability(username))) {
      username = `${baseName.toLowerCase().replace(/[^a-z0-9]/g, '')}${counter}`;
      counter++;
    }
    
    return username;
  }

  // Create user document in Firestore
  async createUserDocument(user, additionalData) {
    const userRef = doc(db, 'users', user.uid);
    const usernameRef = doc(db, 'usernames', additionalData.username.toLowerCase());
    
    // Create user document
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL || '',
      ...additionalData
    });

    // Reserve username
    await setDoc(usernameRef, {
      uid: user.uid,
      createdAt: serverTimestamp()
    });
  }

  // Get user document
  async getUserDocument(uid) {
    return await getDoc(doc(db, 'users', uid));
  }

  // Update user activity
  async updateUserActivity() {
    try {
      if (!auth.currentUser) return;
      
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        lastActivity: serverTimestamp()
      });
    } catch (error) {
      console.error('Activity update error:', error);
    }
  }

  // Add auth state listener
  addAuthStateListener(callback) {
    this.authStateListeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  }

  // Get user by username
  async getUserByUsername(username) {
    try {
      const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
      if (!usernameDoc.exists()) return null;
      
      const userDoc = await this.getUserDocument(usernameDoc.data().uid);
      return userDoc.exists() ? { uid: usernameDoc.data().uid, ...userDoc.data() } : null;
    } catch (error) {
      console.error('Get user by username error:', error);
      return null;
    }
  }

  // Get error message
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No user found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email is already registered',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/invalid-email': 'Invalid email address',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/requires-recent-login': 'Please log in again to perform this action'
    };
    
    return errorMessages[errorCode] || 'An unexpected error occurred';
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService; 