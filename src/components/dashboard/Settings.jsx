import React, { useState, useEffect } from 'react';
import { 
  FiSave, FiLock, FiUser, FiBell, FiShield, 
  FiGlobe, FiSmartphone, FiCpu, FiCheckCircle, 
  FiChevronRight, FiCreditCard, FiActivity, FiMail
} from 'react-icons/fi';
import { authService, userService } from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('Profile');
  const [formData, setFormData] = useState({
    profile: {
      name: '',
      email: '',
      bio: '',
      phone: ''
    },
    notifications: {
      email: true,
      browser: true,
      marketing: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getMe();
        if (data.success) {
          const user = data.data;
          setFormData(prev => ({
            ...prev,
            profile: {
              name: user.name || '',
              email: user.email || '',
              bio: user.bio || '',
              phone: user.phone || ''
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const { data } = await userService.updatePreferences(formData);
      if (data.success) {
        toast.success('Settings saved successfully.');
      }
    } catch (err) {
      toast.error('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: 'Profile', icon: FiUser, label: 'General' },
    { id: 'Security', icon: FiLock, label: 'Security' },
    { id: 'Notifications', icon: FiBell, label: 'Notifications' },
  ];

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading settings...</div>;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Settings</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Manage your profile, security, and notifications</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-slate-900 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeSection === item.id ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          ))}
          
          <div className="mt-8 p-6 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/30 transition-colors"></div>
            <FiCpu className="text-2xl text-primary mb-4 relative" />
            <h4 className="font-black text-[9px] uppercase tracking-widest mb-2 relative">Secure Storage</h4>
            <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter relative">
              Your settings are encrypted and safe.
            </p>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50"></div>
            
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
                  {React.createElement(navItems.find(i => i.id === activeSection)?.icon || FiUser, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">{activeSection} Profile</h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Update your personal details</p>
                </div>
              </div>

              {activeSection === 'Profile' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Full Name</label>
                      <input
                        type="text"
                        value={formData.profile.name}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, name: e.target.value } })}
                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Email Address</label>
                      <input
                        type="email"
                        value={formData.profile.email}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, email: e.target.value } })}
                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Short Bio</label>
                    <textarea
                      rows="4"
                      value={formData.profile.bio}
                      onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, bio: e.target.value } })}
                      className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] resize-none"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'Security' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">New Password</label>
                      <input
                        type="password"
                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Confirm Password</label>
                      <input
                        type="password"
                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'Notifications' && (
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Secure email alerts for critical events' },
                    { key: 'browser', label: 'Browser Alerts', desc: 'Real-time telemetry pings' },
                    { key: 'marketing', label: 'Marketing Emails', desc: 'Briefings on new architectural features' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100/50 transition-colors">
                      <div>
                        <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-wider">{item.label}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications[item.key]}
                          onChange={() => setFormData({
                            ...formData,
                            notifications: { ...formData.notifications, [item.key]: !formData.notifications[item.key] }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-10 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0F172A] text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 transform hover:-translate-y-1 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
