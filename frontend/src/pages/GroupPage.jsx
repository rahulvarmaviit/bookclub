// src/pages/GroupPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Avatar,
  ListItemAvatar,
  Divider,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import NavBar from '../components/layout/NavBar';

export default function GroupPage() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [progressStats, setProgressStats] = useState(null);
  const [chapterSchedules, setChapterSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const res = await api.get(`/groups/${groupId}/`);
        setGroup(res.data);
        
        // Fetch progress statistics (separate try-catch so group details still load)
        try {
          const statsRes = await api.get(`/groups/${groupId}/progress-stats/`);
          setProgressStats(statsRes.data);
        } catch (statsErr) {
          console.error('Failed to load progress stats', statsErr);
          // Don't fail the whole page if stats fail
          setProgressStats(null);
        }

        // Fetch chapter schedules
        try {
          const schedulesRes = await api.get(`/groups/${groupId}/chapter-schedules/`);
          setChapterSchedules(schedulesRes.data);
        } catch (schedulesErr) {
          console.error('Failed to load chapter schedules', schedulesErr);
          setChapterSchedules([]);
        }
      } catch (err) {
        console.error('Failed to load group details', err);
        alert('Failed to load group details. You may not be a member.');
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) fetchGroupDetails();
  }, [groupId, navigate]);

  const handleStartReading = () => {
    navigate(`/groups/${groupId}/read`);
  };

  const handleLeaveGroup = async () => {
    const confirmLeave = window.confirm(
      'Are you sure you want to leave this group? Your reading progress will be deleted.'
    );
    
    if (!confirmLeave) return;
    
    try {
      await api.post(`/groups/${groupId}/leave/`);
      alert('You have left the group successfully.');
      navigate('/home'); // Return to home page
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to leave group';
      alert(`Error: ${errorMsg}`);
    }
  };

  const getScheduleStatus = (schedule) => {
    if (schedule.completed) {
      return { label: 'Completed', color: 'success' };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(schedule.target_completion_date);
    targetDate.setHours(0, 0, 0, 0);
    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) {
      return { label: `${Math.abs(daysRemaining)} day(s) overdue`, color: 'error' };
    } else if (daysRemaining === 0) {
      return { label: 'Due today', color: 'warning' };
    } else if (daysRemaining <= 3) {
      return { label: `${daysRemaining} day(s) remaining`, color: 'warning' };
    } else {
      return { label: `${daysRemaining} day(s) remaining`, color: 'info' };
    }
  };

  if (loading) return <Typography>Loading group details...</Typography>;
  if (!group) return <Typography>Group not found</Typography>;

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            {group.name}
          </Typography>
          {/* Only show Exit Group button if user is not the creator */}
          {user?.id !== group.creator && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleLeaveGroup}
              sx={{ minWidth: '120px' }}
            >
              Exit Group
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Book Details Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={group.book_details?.cover_image || `https://picsum.photos/seed/${group.book}/300/400`}
                alt={group.book_details?.title || 'Book cover'}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {group.book_details?.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  by {group.book_details?.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {group.book_details?.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Genre:</strong> {group.book_details?.genre}
                </Typography>
                <Typography variant="body2">
                  <strong>Pages:</strong> {group.book_details?.total_pages}
                </Typography>
                <Typography variant="body2">
                  <strong>Chapters:</strong> {group.book_details?.total_chapters}
                </Typography>
                
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleStartReading}
                >
                  Start Reading
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/groups/${groupId}/schedule`)}
                  color="secondary"
                >
                  📅 My Chapter Schedule
                </Button>

                {/* Chapter Schedule Preview */}
                {chapterSchedules.length > 0 && (
                  <Paper sx={{ mt: 3, p: 2, bgcolor: '#f9f9f9' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      📋 My Upcoming Chapters
                    </Typography>
                    <List dense>
                      {chapterSchedules
                        .filter(schedule => !schedule.completed)
                        .sort((a, b) => new Date(a.target_completion_date) - new Date(b.target_completion_date))
                        .slice(0, 5)
                        .map((schedule) => {
                          const status = getScheduleStatus(schedule);
                          return (
                            <ListItem key={schedule.id} sx={{ px: 0 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="body2" fontWeight="medium">
                                    Chapter {schedule.chapter_number}: {schedule.chapter_title}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    Target: {new Date(schedule.target_completion_date).toLocaleDateString()}
                                  </Typography>
                                }
                              />
                              <Chip 
                                label={status.label} 
                                color={status.color} 
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </ListItem>
                          );
                        })}
                    </List>
                    {chapterSchedules.filter(s => s.completed).length > 0 && (
                      <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1 }}>
                        ✅ {chapterSchedules.filter(s => s.completed).length} chapter(s) completed
                      </Typography>
                    )}
                    {chapterSchedules.filter(s => !s.completed).length > 5 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        +{chapterSchedules.filter(s => !s.completed).length - 5} more chapters scheduled
                      </Typography>
                    )}
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Group Members List and Progress */}
          <Grid item xs={12} md={6}>
            {/* Group Progress Statistics */}
            {progressStats && (
              <Paper sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                  📊 Group Progress Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Expected Progress: {progressStats.expected_progress}%
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, bgcolor: '#4caf50', color: 'white', textAlign: 'center', minHeight: 80 }}>
                      <Typography variant="h4">{progressStats.completed.count}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>✅ Completed</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, bgcolor: '#2196f3', color: 'white', textAlign: 'center', minHeight: 80 }}>
                      <Typography variant="h4">{progressStats.on_track.count}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>👍 On Track</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, bgcolor: '#ff9800', color: 'white', textAlign: 'center', minHeight: 80 }}>
                      <Typography variant="h4">{progressStats.behind.count}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>⚠️ Behind</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, bgcolor: '#757575', color: 'white', textAlign: 'center', minHeight: 80 }}>
                      <Typography variant="h4">{progressStats.not_started.count}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 0.5, whiteSpace: 'nowrap' }}>⏸️ Not Started</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            )}

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Group Members ({group.members?.length || 0})
              </Typography>
              <List>
                {group.members?.map((member) => {
                  // Find member's progress status
                  let statusColor = 'default';
                  let statusText = 'Not Started';
                  let progressPercent = 0;
                  
                  if (progressStats) {
                    const completed = progressStats.completed.members.find(m => m.username === member.username);
                    const onTrack = progressStats.on_track.members.find(m => m.username === member.username);
                    const behind = progressStats.behind.members.find(m => m.username === member.username);
                    const notStarted = progressStats.not_started.members.find(m => m.username === member.username);
                    
                    if (completed) {
                      statusColor = '#4caf50';
                      statusText = '✅ Completed';
                      progressPercent = 100;
                    } else if (onTrack) {
                      statusColor = '#2196f3';
                      statusText = `👍 ${onTrack.progress_percent}%`;
                      progressPercent = onTrack.progress_percent;
                    } else if (behind) {
                      statusColor = '#ff9800';
                      statusText = `⚠️ ${behind.progress_percent}%`;
                      progressPercent = behind.progress_percent;
                    } else if (notStarted) {
                      statusColor = '#757575';
                      statusText = '⏸️ Not Started';
                      progressPercent = 0;
                    }
                  }
                  
                  return (
                    <React.Fragment key={member.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: statusColor }}>
                            {member.username[0].toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography>{member.username}</Typography>
                              <Typography variant="caption" sx={{ color: statusColor, fontWeight: 'bold' }}>
                                {statusText}
                              </Typography>
                            </Box>
                          }
                          secondary={`Joined: ${new Date(member.joined_at).toLocaleDateString()}`}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>

            {/* Group Info */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Reading Schedule
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Start Date:</strong> {group.start_date}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>End Date:</strong> {group.end_date}
              </Typography>
              <Typography variant="body1">
                <strong>Created by:</strong> {group.creator_name}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
