# StellarHack 🚀

A modern, responsive social media platform built with React and Firebase. StellarHack provides users with a seamless experience to share posts, connect with others, and manage their profiles in real-time.

## ✨ Features

- **User Authentication**: Secure login and registration system powered by Firebase Auth
- **Real-time Posts**: Create, view, and interact with posts instantly
- **User Profiles**: Customizable user profiles with profile picture support
- **Post Management**: Create, edit, and delete your own posts
- **Search Functionality**: Find users and posts easily
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern Interface**: Clean and intuitive design with Tailwind CSS

## 🛠️ Technologies Used

- **Frontend**: React.js, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Routing**: React Router
- **Build Tool**: Create React App
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/StellarHack.git
   cd StellarHack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore Database, and Storage
   - Copy your Firebase config and update `src/firebase/config.js`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the application running.

## 📱 Pages & Components

- **Homepage**: Main feed with all posts
- **Login/Register**: User authentication pages
- **Profile**: User profile management
- **Create Post**: Post creation interface
- **Post Detail**: Individual post view
- **Search**: User and post search functionality
- **Edit Profile**: Profile customization

## 🏗️ Project Structure

```
StellarHack/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Homepage.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Profile.js
│   │   ├── CreatePost.js
│   │   ├── PostDetail.js
│   │   ├── Search.js
│   │   ├── EditProfile.js
│   │   ├── NotFound.js
│   │   └── ProtectedRoute.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── PostService.js
│   │   └── UserService.js
│   ├── firebase/
│   │   └── config.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🌟 Key Features Explained

### Authentication System
- Secure user registration and login
- Password reset functionality
- Protected routes for authenticated users
- Real-time authentication state management

### Post Management
- Rich text post creation
- Image upload support
- Real-time post updates
- User-specific post filtering

### User Profiles
- Customizable profile information
- Profile picture upload
- User activity tracking
- Follow/connection system ready

## 🚀 Deployment

This project can be easily deployed to various platforms:

- **Firebase Hosting**: `npm run build && firebase deploy`
- **Netlify**: Connect your GitHub repository
- **Vercel**: Import project from GitHub

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for the backend services
- Tailwind CSS for the styling system
- All contributors who helped shape this project

---

⭐ Star this repository if you found it helpful! 