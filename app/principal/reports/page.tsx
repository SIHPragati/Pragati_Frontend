'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  FileText,
  Filter,
  Search,
  ChevronDown,
  LogOut,
  UserCircle,
  BookOpen,
} from 'lucide-react';

interface ClassroomReport {
  classroomId: string;
  grade: { id: string; name: string; level: number };
  section: { id: string; label: string };
  totalSessions: number;
  totalRecords: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

interface AttendanceReport {
  schoolId: string;
  range: { start: string; end: string };
  totals: {
    sessions: number;
    totalRecords: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
  };
  classrooms: ClassroomReport[];
  topClassrooms: Array<{ classroomId: string; attendanceRate: number; totalRecords: number }>;
  bottomClassrooms: Array<{ classroomId: string; attendanceRate: number; totalRecords: number }>;
  generatedAt: string;
}

export default function AttendanceReportsPage() {
  const router = useRouter();
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [principalName, setPrincipalName] = useState('Principal');

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('pragati_token');
      const role = localStorage.getItem('pragati_role');
      const name = localStorage.getItem('pragati_name') || 'Principal';

      if (!token || role !== 'PRINCIPAL') {
        router.push('/login/principal');
        return;
      }

      setPrincipalName(name);

      // Set default dates (last 30 days)
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);

      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);

      fetchReport(token, start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
    }
  }, [router]);

  const fetchReport = async (token: string, start: string, end: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');
      const response = await fetch(
        `${backendUrl}/api/reports/attendance/principal?start=${start}&end=${end}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError('Unable to load attendance report. Please try again.');
      console.error('Error fetching report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    const token = localStorage.getItem('pragati_token');
    if (token && startDate && endDate) {
      fetchReport(token, startDate, endDate);
    }
  };

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem('pragati_token');
    if (!token || !startDate || !endDate) return;

    try {
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000').replace(/\/$/, '');
      const response = await fetch(
        `${backendUrl}/api/reports/attendance/principal/pdf?start=${startDate}&end=${endDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${startDate}-to-${endDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading PDF:', err);
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

  const filteredClassrooms = report?.classrooms.filter((classroom) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      classroom.grade.name.toLowerCase().includes(searchLower) ||
      classroom.section.label.toLowerCase().includes(searchLower)
    );
  }) || [];

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
                <h1 className="text-sm sm:text-lg font-bold">Attendance Reports</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">School-wide analytics</p>
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
            className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-white/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-white/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="flex gap-2 sm:items-end">
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition disabled:opacity-50"
                >
                  <Filter className="w-4 h-4 inline-block mr-2" />
                  Generate
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={!report || isLoading}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition disabled:opacity-50"
                >
                  <Download className="w-4 h-4 inline-block mr-2" />
                  PDF
                </button>
              </div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="mt-4 text-sm text-muted-foreground">Loading report...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50/70 dark:bg-red-950/40 backdrop-blur-xl p-6 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Report Content */}
          {!isLoading && report && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-5"
                >
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-3">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Total Records</p>
                  <p className="text-xl sm:text-2xl font-bold">{report.totals.totalRecords.toLocaleString()}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-5"
                >
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white mb-3">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Attendance Rate</p>
                  <p className="text-xl sm:text-2xl font-bold">{(report.totals.attendanceRate * 100).toFixed(1)}%</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-5"
                >
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white mb-3">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Total Sessions</p>
                  <p className="text-xl sm:text-2xl font-bold">{report.totals.sessions}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-4 sm:p-5"
                >
                  <div className="inline-flex p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 text-white mb-3">
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Present</p>
                  <p className="text-xl sm:text-2xl font-bold">{report.totals.present.toLocaleString()}</p>
                </motion.div>
              </div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-3"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by grade or section..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur-sm text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </motion.div>

              {/* Classroom Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-2xl border border-white/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-white/40">
                  <h3 className="text-lg font-semibold">Classroom Breakdown</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing {filteredClassrooms.length} of {report.classrooms.length} classrooms
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Classroom</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Sessions</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Present</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Absent</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40">
                      {filteredClassrooms.map((classroom) => (
                        <tr
                          key={classroom.classroomId}
                          className="hover:bg-white/50 dark:hover:bg-slate-800/50 transition"
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {classroom.grade.name} - {classroom.section.label}
                          </td>
                          <td className="px-4 py-3 text-sm">{classroom.totalSessions}</td>
                          <td className="px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                            {classroom.present}
                          </td>
                          <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">{classroom.absent}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-[80px]">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                  style={{ width: `${classroom.attendanceRate * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{(classroom.attendanceRate * 100).toFixed(1)}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
