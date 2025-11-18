'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MessageSquare,
  User,
  Calendar,
  LogOut,
  UserCircle,
  Eye,
  Edit,
} from 'lucide-react';

type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'dismissed';

type ComplaintCategory =
  | 'lack_of_proper_drinking_water'
  | 'toilets'
  | 'girls_toilets'
  | 'liberty'
  | 'proper_electricity'
  | 'computers';

interface Complaint {
  id: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  description: string;
  isAnonymous: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    code: string;
  } | null;
  classroom: {
    id: string;
    grade: { name: string };
    section: { label: string };
  };
  resolutionNote: string | null;
  resolvedBy: {
    id: string;
    role: string;
    email: string;
  } | null;
  createdAt: string;
  resolvedAt?: string;
}

interface ComplaintsResponse {
  schoolId: string;
  total: number;
  items: Complaint[];
}

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('open');
  const [isUpdating, setIsUpdating] = useState(false);
  const [principalName, setPrincipalName] = useState('Principal');

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
      fetchComplaints(token);
    }
  }, [router]);

  const fetchComplaints = async (token: string, status?: ComplaintStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');
      const url = status
        ? `${backendUrl}/api/complaints?status=${status}`
        : `${backendUrl}/api/complaints`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data: ComplaintsResponse = await response.json();
      setComplaints(data.items);
    } catch (err) {
      setError('Unable to load complaints. Please try again.');
      console.error('Error fetching complaints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('pragati_token');
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');

      const response = await fetch(`${backendUrl}/api/complaints/${selectedComplaint.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          resolutionNote: resolutionNote.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update complaint');
      }

      // Refresh complaints list
      if (token) {
        await fetchComplaints(token, statusFilter !== 'all' ? statusFilter : undefined);
      }

      setSelectedComplaint(null);
      setResolutionNote('');
    } catch (err) {
      console.error('Error updating complaint:', err);
    } finally {
      setIsUpdating(false);
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

  const handleFilterChange = (status: ComplaintStatus | 'all') => {
    setStatusFilter(status);
    const token = localStorage.getItem('pragati_token');
    if (token) {
      fetchComplaints(token, status !== 'all' ? status : undefined);
    }
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'dismissed':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case 'open':
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'in_progress':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'dismissed':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryLabel = (category: ComplaintCategory) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchLower = searchQuery.toLowerCase();
    const categoryMatch = getCategoryLabel(complaint.category).toLowerCase().includes(searchLower);
    const descriptionMatch = complaint.description.toLowerCase().includes(searchLower);
    const studentMatch = complaint.student
      ? `${complaint.student.firstName} ${complaint.student.lastName}`.toLowerCase().includes(searchLower)
      : false;

    return categoryMatch || descriptionMatch || studentMatch;
  });

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
                <h1 className="text-sm sm:text-lg font-bold">Complaints Management</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {complaints.length} total complaints
                </p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 sm:pt-36 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-6 space-y-4"
          >
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'open', 'in_progress', 'resolved', 'dismissed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                    statusFilter === status
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {status === 'all' ? 'All' : status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by category, description, or student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-sm text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="mt-4 text-sm text-muted-foreground">Loading complaints...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 dark:bg-red-950/40 backdrop-blur-xl p-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Complaints List */}
          {!isLoading && !error && (
            <div className="space-y-3">
              {filteredComplaints.length === 0 ? (
                <div className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No complaints found</p>
                </div>
              ) : (
                filteredComplaints.map((complaint, index) => (
                  <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-6 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Status Icon */}
                      <div className={`flex-shrink-0 p-3 rounded-xl ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold">{getCategoryLabel(complaint.category)}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {complaint.classroom.grade.name} - {complaint.classroom.section.label}
                              {complaint.student && !complaint.isAnonymous && (
                                <> · {complaint.student.firstName} {complaint.student.lastName}</>
                              )}
                              {complaint.isAnonymous && <> · Anonymous</>}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${getStatusColor(complaint.status)}`}>
                            {complaint.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                        </div>

                        <p className="text-sm text-foreground">{complaint.description}</p>

                        {complaint.resolutionNote && (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                              Resolution Note:
                            </p>
                            <p className="text-xs text-foreground">{complaint.resolutionNote}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <p className="text-[10px] text-muted-foreground">
                            Submitted {new Date(complaint.createdAt).toLocaleDateString()}
                          </p>
                          <button
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setNewStatus(complaint.status);
                              setResolutionNote(complaint.resolutionNote || '');
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition"
                          >
                            <Edit className="w-3 h-3" />
                            Update
                          </button>
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

      {/* Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-white/40 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold mb-4">Update Complaint</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Resolution Note</label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={4}
                  placeholder="Add a note about the resolution..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateComplaint}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
