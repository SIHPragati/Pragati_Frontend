'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  Plus,
  Send,
  Calendar,
  Users,
  AlertCircle,
  Info,
  Megaphone,
  LogOut,
  UserCircle,
  X,
  Clock,
} from 'lucide-react';

type NotificationCategory = 'general' | 'academic' | 'event' | 'urgent';

interface Notification {
  id: string;
  schoolId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: number;
  isPublic: boolean;
  activeFrom: string;
  activeTill: string;
  createdAt: string;
  targets?: Array<{
    type: string;
    studentId?: string;
    classroomId?: string;
  }>;
}

interface NotificationsResponse {
  total: number;
  items: Notification[];
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [principalName, setPrincipalName] = useState('Principal');

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NotificationCategory>('general');
  const [priority, setPriority] = useState(2);
  const [isPublic, setIsPublic] = useState(true);
  const [activeFrom, setActiveFrom] = useState('');
  const [activeTill, setActiveTill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('pragati_token');
      const role = localStorage.getItem('pragati_role');
      const name = localStorage.getItem('pragati_name') || 'Principal';

      if (!token || role !== 'PRINCIPAL') {
        router.push('/login/principal');
        return;
      }

      setPrincipalName(name);
      fetchNotifications(token);

      // Set default dates
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);

      setActiveFrom(now.toISOString().slice(0, 16));
      setActiveTill(nextWeek.toISOString().slice(0, 16));
    }
  }, [router]);

  const fetchNotifications = async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');
      const response = await fetch(`${backendUrl}/api/communications/notifications/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to load notifications. Please try again.');
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    if (!title.trim() || !body.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('pragati_token');
      const userId = localStorage.getItem('pragati_userId');
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');

      const payload = {
        schoolId: '1', // This would come from the authenticated user's school
        title,
        body,
        category,
        priority,
        isPublic,
        activeFrom,
        activeTill,
        createdBy: userId || '1',
        targets: isPublic
          ? undefined
          : {
              studentIds: [],
              studentGroupIds: [],
              teacherIds: [],
              classroomIds: [],
            },
      };

      const response = await fetch(`${backendUrl}/api/communications/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create notification');
      }

      // Reset form and close modal
      setTitle('');
      setBody('');
      setCategory('general');
      setPriority(2);
      setIsPublic(true);
      setShowCreateModal(false);

      // Refresh notifications
      if (token) {
        await fetchNotifications(token);
      }
    } catch (err) {
      console.error('Error creating notification:', err);
      setError('Failed to create notification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pragati_token');
      localStorage.removeItem('pragati_role');
      localStorage.removeItem('pragati_userId');
      localStorage.removeItem('pragati_name');
    }
    router.push('/login/principal');
  };

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'general':
        return <Info className="w-4 h-4" />;
      case 'academic':
        return <AlertCircle className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'urgent':
        return <Megaphone className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: NotificationCategory) => {
    switch (cat) {
      case 'general':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'academic':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'event':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'urgent':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
    }
  };

  const getPriorityColor = (pri: number) => {
    if (pri >= 4) return 'bg-red-500/20 text-red-700 dark:text-red-400';
    if (pri >= 3) return 'bg-orange-500/20 text-orange-700 dark:text-orange-400';
    return 'bg-gray-500/20 text-gray-700 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      {/* Top Government Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs font-bold">
              🇮🇳
            </div>
            <span className="font-semibold hidden sm:inline">GOVERNMENT OF INDIA</span>
            <span className="font-semibold sm:hidden">GOI</span>
          </div>
          <span className="text-[10px] sm:text-xs">Ministry of Education · Pragati Portal</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="fixed top-10 sm:top-12 left-0 right-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/principal')}
                className="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm sm:text-lg font-bold">Notifications</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {notifications.length} active notifications
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition"
              >
                <Plus className="w-4 h-4" />
                Create
              </button>

              <div className="inline-flex items-center rounded-full bg-white/70 dark:bg-slate-900/70 border border-white/60 px-1 py-0.5 text-[11px] shadow-sm backdrop-blur-xl">
                <button type="button" className="px-2 py-0.5 rounded-full bg-primary text-white font-medium">
                  English
                </button>
                <button
                  type="button"
                  className="px-2 py-0.5 rounded-full text-muted-foreground hover:bg-white/80 dark:hover:bg-slate-800/80 transition"
                >
                  ਪੰਜਾਬੀ
                </button>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 dark:bg-slate-900/60 border border-white/40 backdrop-blur-xl">
                <UserCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium">{principalName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-500/20 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>

            {/* Mobile Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="md:hidden p-2 rounded-lg bg-primary text-white"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 sm:pt-36 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="mt-4 text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 dark:bg-red-950/40 backdrop-blur-xl p-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Notifications List */}
          {!isLoading && !error && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-12 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No active notifications</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Create your first notification
                  </button>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 sm:p-6 hover:shadow-lg transition"
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-3 rounded-xl ${getCategoryColor(notification.category)}`}>
                        {getCategoryIcon(notification.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h3 className="text-base font-semibold">{notification.title}</h3>
                          <div className="flex gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getCategoryColor(
                                notification.category
                              )}`}
                            >
                              {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                            </span>
                            {notification.priority >= 3 && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getPriorityColor(notification.priority)}`}>
                                Priority {notification.priority}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-foreground mb-3">{notification.body}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Active until {new Date(notification.activeTill).toLocaleDateString()}
                          </div>
                          {notification.isPublic && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Public
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl rounded-2xl border border-white/40 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Create Notification</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  placeholder="Notification message..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NotificationCategory)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="event">Event</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Priority (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Active From</label>
                  <input
                    type="datetime-local"
                    value={activeFrom}
                    onChange={(e) => setActiveFrom(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Active Until</label>
                  <input
                    type="datetime-local"
                    value={activeTill}
                    onChange={(e) => setActiveTill(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isPublic" className="text-sm text-foreground">
                  Make this notification public (visible to everyone)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNotification}
                  disabled={isSubmitting || !title.trim() || !body.trim()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send Notification'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
