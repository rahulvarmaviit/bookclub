// src/pages/DiscussionForum.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import NavBar from '../components/layout/NavBar';

export default function DiscussionForum() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null); // Track which post is being replied to
  const [replyContent, setReplyContent] = useState(''); // Reply text
  const EMOJIS = ['👍', '❤️', '😂', '😮', '😢'];

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/groups/${groupId}/discussion/`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load discussion', err);
      alert('You must be a group member to view this forum');
      navigate('/home'); // Go back to dashboard
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) fetchPosts();
  }, [groupId]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    try {
      const payload = {
        content: newPost.trim(),
      };
      const res = await api.post(`/groups/${groupId}/discussion/`, payload);
      setPosts([res.data, ...posts]); // optimistic update
      setNewPost('');
    } catch (err) {
      console.error('Post error:', err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.content?.[0] || 'Failed to post';
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleReply = async (postId) => {
    if (!replyContent.trim()) return;
    try {
      const payload = {
        content: replyContent.trim(),
      };
      const res = await api.post(`/posts/${postId}/comments/`, payload);
      // Update the post with the new comment
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...(post.comments || []), res.data] }
          : post
      ));
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Reply error:', err.response?.data);
      const errorMsg = err.response?.data?.error || err.response?.data?.content?.[0] || 'Failed to reply';
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleToggleReaction = async (postId, emoji) => {
    try {
      const res = await api.post(`/posts/${postId}/reactions/`, { emoji });
      // Update the post's reactions in state
      setPosts(posts.map(p => p.id === postId ? { ...p, reactions: res.data.reactions } : p));
    } catch (err) {
      console.error('Reaction error:', err.response?.data || err);
      alert(err.response?.data?.error || 'Failed to toggle reaction');
    }
  };

  if (loading) return <Typography>Loading discussion...</Typography>;

  return (
    <>
      <NavBar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Group Discussion
        </Typography>

        {/* New Post Form */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your thoughts on the book..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ mt: 1 }}
            onClick={handleCreatePost}
          >
            Post
          </Button>
        </Paper>

        {/* Posts List */}
        <List>
          {posts.map((post) => (
            <React.Fragment key={post.id}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <ListItem alignItems="flex-start" sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {post.author_name[0].toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {post.author_name}
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {new Date(post.created_at).toLocaleDateString()}
                        </Typography>
                      </Typography>
                    }
                    secondary={
                      <Typography component="span" variant="body2" sx={{ display: 'block', mt: 1 }}>
                        {post.content}
                      </Typography>
                    }
                  />
                </ListItem>

                {/* Comments/Replies */}
                {post.comments && post.comments.length > 0 && (
                  <Box sx={{ ml: 7, mt: 2, borderLeft: '2px solid #e0e0e0', pl: 2 }}>
                    {post.comments.map((comment) => (
                      <Box key={comment.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {comment.author_name}
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </Typography>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {comment.content}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Reply Button and Form */}
                <Box sx={{ ml: 7, mt: 2 }}>
                  {/* Reactions row */}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                    {EMOJIS.map((emoji) => {
                      const count = (post.reactions || []).filter(r => r.emoji === emoji).length;
                      const userReacted = (post.reactions || []).some(r => r.emoji === emoji && r.user === user?.id);
                      return (
                        <Button
                          key={emoji}
                          size="small"
                          variant={userReacted ? 'contained' : 'outlined'}
                          onClick={() => handleToggleReaction(post.id, emoji)}
                        >
                          {emoji} {count > 0 ? count : ''}
                        </Button>
                      );
                    })}
                  </Box>
                  {replyingTo === post.id ? (
                    <Box>
                      <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleReply(post.id)}
                        sx={{ mr: 1 }}
                      >
                        Reply
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => setReplyingTo(post.id)}
                    >
                      Reply
                    </Button>
                  )}
                </Box>
              </Paper>
            </React.Fragment>
          ))}
        </List>
      </Box>
    </>
  );
}