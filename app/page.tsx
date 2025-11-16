'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Menu, X, BookOpen, Users, BarChart3, Shield, Zap, ChevronLeft, ChevronDown } from 'lucide-react';

export default function PragatiLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeRole, setActiveRole] = useState(null);
  const noticesRef = useRef(null);
  const bannersRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const roles = [
    {
      id: 'student',
      title: 'Student',
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Track attendance, view marks',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'teacher',
      title: 'Teacher',
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Mark attendance efficiently',
      color: 'from-teal-500 to-green-500',
    },
    {
      id: 'principal',
      title: 'Principal',
      icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Monitor school-wide data',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'government',
      title: 'Government',
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      description: 'Access compliance reports',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const notices = [
    { id: 1, title: 'System Maintenance', date: 'Nov 20, 2025', icon: '🔧' },
    { id: 2, title: 'New Features Released', date: 'Nov 18, 2025', icon: '✨' },
    { id: 3, title: 'Mid-day Meal Report Due', date: 'Nov 15, 2025', icon: '🍽️' },
    { id: 4, title: 'Academic Calendar Update', date: 'Nov 10, 2025', icon: '📅' },
    { id: 5, title: 'Scholarship Submission Deadline', date: 'Nov 8, 2025', icon: '🎓' },
  ];

  const governmentPrograms = [
    {
      id: 1,
      title: 'Mid-Day Meal Scheme',
      description: 'Nutrition support for all enrolled students',
      color: 'bg-gradient-to-br from-orange-400 to-orange-600',
      icon: '🍽️',
    },
    {
      id: 2,
      title: 'National Education Policy 2020',
      description: 'Implementation of NEP 2020 guidelines',
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      icon: '📚',
    },
    {
      id: 3,
      title: 'PM Shri Scheme',
      description: 'Pradhan Mantri Schools for Rising India',
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      icon: '🏫',
    },
    {
      id: 4,
      title: 'DIKSHA Platform',
      description: 'Digital Infrastructure for Knowledge Sharing',
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      icon: '💻',
    },
    {
      id: 5,
      title: 'SAMAGRA Portal',
      description: 'Student & Academic Management',
      color: 'bg-gradient-to-br from-red-400 to-red-600',
      icon: '📊',
    },
    {
      id: 6,
      title: 'e-Pathshala Resources',
      description: 'Digital Learning Content Access',
      color: 'bg-gradient-to-br from-teal-400 to-teal-600',
      icon: '🎓',
    },
  ];

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: 'Real-time Tracking', desc: 'Instant attendance updates' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Smart Analytics', desc: 'Comprehensive reports' },
    { icon: <Shield className="w-6 h-6" />, title: 'Secure Data', desc: 'Government-grade security' },
    { icon: <Users className="w-6 h-6" />, title: 'Multi-Role Access', desc: 'Role-based dashboards' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 overflow-x-hidden">
      {/* Government Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-2 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs font-bold">🇮🇳</div>
            <span className="font-semibold">GOVERNMENT OF INDIA</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden sm:inline cursor-pointer hover:opacity-80 transition"
            >
              Skip to main content
            </button>
            <button className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition">
              <span>🌐</span>
              English
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="fixed top-10 sm:top-11 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Image
                src="/pragati-logo.png"
                alt="Pragati e-Punjab School logo"
                width={64}
                height={64}
                priority
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow"
              />
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">Pragati</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">e-Punjab School</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <div className="group relative">
                <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary flex items-center gap-1 transition">
                  Activities <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <a href="#roles" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition">
                Roles
              </a>
              <a href="#programs" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition">
                Programs
              </a>
              <a href="#notices" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition">
                Updates
              </a>
              <a href="#contact" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition">
                Help
              </a>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                🔍
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center text-white cursor-pointer font-bold">
                👤
              </div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
              <a href="#roles" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition">
                Roles
              </a>
              <a href="#programs" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition">
                Programs
              </a>
              <a href="#notices" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition">
                Updates
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-32 sm:pt-40 pb-20 overflow-hidden"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ top: '10%', left: '10%' }}
          />
          <div
            className="absolute w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ top: '50%', right: '10%', animationDelay: '2s' }}
          />
          <div
            className="absolute w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow"
            style={{ bottom: '10%', left: '50%', animationDelay: '4s' }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-in fade-in duration-1000">
            <div className="inline-block glass px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-primary">Government Education Initiative</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Pragati</span>
              <br />
              <span className="text-foreground">Smart Attendance System</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforming rural education through intelligent attendance tracking. Empowering teachers, students, and administrators with real-time insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="glass-light px-8 py-3 rounded-lg font-semibold text-primary hover:bg-white/50 dark:hover:bg-white/15 transition group">
                Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition inline-block ml-2" />
              </button>
              <button className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section id="roles" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative z-20 bg-white/30 dark:bg-white/5 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Role-Based <span className="gradient-text">Access</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Tailored interfaces for each stakeholder. Choose your role to login.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setActiveRole(activeRole === role.id ? null : role.id)}
                className={`glass rounded-lg border border-gray-200 dark:border-gray-700 transition cursor-pointer overflow-hidden ${
                  activeRole === role.id
                    ? 'border-accent/50 bg-gradient-to-br ' + role.color + '/10 shadow-lg shadow-accent/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-accent/30'
                }`}
              >
                {/* Icon and basic info */}
                <div className="p-3 sm:p-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${role.color} text-white flex-shrink-0`}
                  >
                    {role.icon}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm mb-1">{role.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{role.description}</p>
                  
                  {/* Login Button inside card */}
                  <button
                    className={`w-full px-2 sm:px-3 py-2 rounded-lg font-semibold text-xs transition group ${
                      activeRole === role.id
                        ? `bg-gradient-to-r ${role.color} text-white shadow-lg`
                        : 'glass-light hover:bg-white/50 dark:hover:bg-white/15 border border-white/30'
                    }`}
                  >
                    Login <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition inline-block ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Why <span className="gradient-text">Pragati?</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Addressing the challenges of rural education with modern technology and thoughtful design.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="glass-light p-3 sm:p-4 rounded-lg border border-white/30 hover:border-white/50 transition group hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white mb-2 sm:mb-3 group-hover:scale-110 transition text-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="notices" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-white/5 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Latest Updates</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Join our notification hub to stay up to date</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => window.scrollBy({ left: -400, behavior: 'smooth' })}
              className="absolute -left-4 sm:left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={noticesRef}
              className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="glass flex-shrink-0 w-full sm:w-96 snap-start p-4 sm:p-6 rounded-2xl border border-white/30 hover:border-accent/50 transition group cursor-pointer hover:shadow-lg hover:shadow-accent/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{notice.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition">{notice.title}</h3>
                      </div>
                      <span className="text-xs text-muted-foreground">{notice.date}</span>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2">Important update regarding system and policy changes.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.scrollBy({ left: 400, behavior: 'smooth' })}
              className="absolute -right-4 sm:right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="sm:hidden text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Swipe to see more updates
          </div>
        </div>
      </section>

      {/* Government Programs Section */}
      <section id="programs" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Government Programs & Schemes</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Important initiatives aligned with our attendance system</p>
          </div>

          {/* Banners Carousel */}
          <div className="relative">
            <button
              onClick={() => window.scrollBy({ left: -400, behavior: 'smooth' })}
              className="absolute -left-4 sm:left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={bannersRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
              {governmentPrograms.map((program) => (
                <div
                  key={program.id}
                  className="flex-shrink-0 w-full sm:w-80 snap-start"
                >
                  <div className={`${program.color} rounded-2xl p-4 sm:p-6 text-white h-full flex flex-col justify-between group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
                    <div>
                      <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{program.icon}</div>
                      <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{program.title}</h3>
                      <p className="text-xs sm:text-sm text-white/90">{program.description}</p>
                    </div>
                    <button className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-white/80 hover:text-white flex items-center gap-2 transition">
                      Learn More <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.scrollBy({ left: 400, behavior: 'smooth' })}
              className="absolute -right-4 sm:right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile scroll indicator */}
          <div className="sm:hidden text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            Swipe to see more programs
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/20 bg-white/30 dark:bg-white/5 backdrop-blur-lg py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Image
                    src="/pragati-logo.png"
                    alt="Pragati e-Punjab School logo"
                    width={40}
                    height={40}
                    className="w-8 h-8 object-contain drop-shadow"
                  />
                  <span className="font-bold text-sm sm:text-base">Pragati</span>
                </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Smart attendance for rural schools</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Features</a></li>
                <li><a href="#" className="hover:text-primary transition">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">About</a></li>
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            <p>&copy; 2025 Pragati. Transforming rural education in India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
