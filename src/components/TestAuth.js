import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TestAuth = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('123456');
  const [testUsername, setTestUsername] = useState('testuser');
  const [testFullName, setTestFullName] = useState('Test User');
  const [result, setResult] = useState('');
  
  const { register, login, loginWithGoogle, logout, currentUser, userData, error } = useAuth();

  const handleTestRegister = async () => {
    try {
      setResult('Testing registration...');
      const response = await register({
        email: testEmail,
        password: testPassword,
        username: testUsername,
        fullName: testFullName
      });
      setResult(`Registration successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`Registration failed: ${error.message}`);
    }
  };

  const handleTestLogin = async () => {
    try {
      setResult('Testing login...');
      const response = await login(testEmail, testPassword);
      setResult(`Login successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`Login failed: ${error.message}`);
    }
  };

  const handleTestGoogleLogin = async () => {
    try {
      setResult('Testing Google login...');
      const response = await loginWithGoogle();
      setResult(`Google login successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`Google login failed: ${error.message}`);
    }
  };

  const handleTestLogout = async () => {
    try {
      setResult('Testing logout...');
      const response = await logout();
      setResult(`Logout successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`Logout failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        {/* Current State */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Current User:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {currentUser ? JSON.stringify(currentUser, null, 2) : 'Not logged in'}
              </pre>
            </div>
            <div>
              <h3 className="font-medium">User Data:</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {userData ? JSON.stringify(userData, null, 2) : 'No user data'}
              </pre>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}
        </div>

        {/* Test Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Form</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username:</label>
              <input
                type="text"
                value={testUsername}
                onChange={(e) => setTestUsername(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name:</label>
              <input
                type="text"
                value={testFullName}
                onChange={(e) => setTestFullName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleTestRegister}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Test Register
            </button>
            <button
              onClick={handleTestLogin}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Login
            </button>
            <button
              onClick={handleTestGoogleLogin}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Test Google Login
            </button>
            <button
              onClick={handleTestLogout}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Test Logout
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Result</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAuth; 