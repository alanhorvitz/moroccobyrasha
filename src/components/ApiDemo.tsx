import React, { useState, useEffect } from 'react';
import { userApi, postApi, User, Post } from '../lib/api';

export default function ApiDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, postsData] = await Promise.all([
        userApi.getAll(),
        postApi.getAll(),
      ]);
      setUsers(usersData);
      setPosts(postsData);
    } catch (err) {
      setError('Failed to fetch data from API');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const newUser = await userApi.create({
        email: `user${Date.now()}@example.com`,
        name: `User ${Date.now()}`,
      });
      setUsers([...users, newUser]);
    } catch (err) {
      setError('Failed to create user');
      console.error('Create User Error:', err);
    }
  };

  const createPost = async () => {
    if (users.length === 0) {
      setError('No users available to create post');
      return;
    }

    try {
      const newPost = await postApi.create({
        title: `Post ${Date.now()}`,
        content: `This is a new post created at ${new Date().toLocaleString()}`,
        authorId: users[0].id,
      });
      setPosts([...posts, newPost]);
    } catch (err) {
      setError('Failed to create post');
      console.error('Create Post Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading data from API...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">API Integration Demo</h1>
        <p className="text-gray-600 mb-6">
          This demonstrates the integration between React frontend and Express.js backend with Prisma
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Users ({users.length})</h2>
            <button
              onClick={createUser}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Add User
            </button>
          </div>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="border p-3 rounded">
                <div className="font-medium">{user.name || 'No name'}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="text-xs text-gray-500">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
            <button
              onClick={createPost}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Add Post
            </button>
          </div>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="border p-3 rounded">
                <div className="font-medium">{post.title}</div>
                <div className="text-sm text-gray-600 line-clamp-2">
                  {post.content || 'No content'}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  By: {post.author?.name || 'Unknown'} |{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={fetchData}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
} 