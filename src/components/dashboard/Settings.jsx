import React, { useState, useEffect } from 'react';
import { 
  FiSave, FiLock, FiUser, FiBell, FiShield, 
  FiGlobe, FiSmartphone, FiCpu, FiCheckCircle, 
  FiChevronRight, FiCreditCard, FiActivity, FiMail,
  FiEye, FiEyeOff
} from 'react-icons/fi';
import { authService, userService } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { CURRENCIES } from '../../constants/currencies';

const Settings = () => {
  const { fetchUser, fetchPublicProfile } = useAuth();
  const [activeSection, setActiveSection] = useState('Profile');
  const [formData, setFormData] = useState({
    profile: {
      name: '',
      email: '',
      company: '',
      currency: 'USD',
      bio: '',
      companyLogo: null,
      companyLogoPreview: ''
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getMe();
        if (data.success) {
          const user = data.data;
          setFormData(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              name: user.name || '',
              email: user.email || '',
              company: user.company || '',
              currency: user.currency || 'USD',
              bio: user.bio || '',
              companyLogoPreview: user.companyLogo || ''
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      data.append('name', formData.profile.name);
      data.append('email', formData.profile.email);
      data.append('company', formData.profile.company);
      data.append('currency', formData.profile.currency);
      data.append('bio', formData.profile.bio);
      if (formData.profile.companyLogo) {
        data.append('companyLogo', formData.profile.companyLogo);
      }

      const res = await userService.updateProfile(data);
      if (res.data.success) {
        toast.success('Profile updated successfully.');
        // Refresh both the auth user AND the public profile so header updates everywhere
        await Promise.all([fetchUser(), fetchPublicProfile()]);
      }
    } catch (err) {
      toast.error('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData.security;
    if (!currentPassword) return toast.error('Please enter your current password.');
    if (newPassword.length < 6) return toast.error('New password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match.');
    try {
      setSaving(true);
      const res = await userService.updatePassword({ currentPassword, newPassword });
      if (res.data.success) {
        toast.success('Password updated successfully.');
        setFormData(prev => ({ ...prev, security: { currentPassword: '', newPassword: '', confirmPassword: '' } }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating password.');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: 'Profile', icon: FiUser, label: 'General' },
    { id: 'Security', icon: FiLock, label: 'Security' },
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
        </div>

        <div className="flex-1">
          <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50"></div>
            
            <form onSubmit={activeSection === 'Profile' ? handleProfileSubmit : handleSecuritySubmit} className="relative">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
                  {React.createElement(navItems.find(i => i.id === activeSection)?.icon || FiUser, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                    {activeSection === 'Profile' ? 'Profile Settings' : 'Change Password'}
                  </h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {activeSection === 'Profile' ? 'Update your personal details' : 'Update your account password'}
                  </p>
                </div>
              </div>

              {activeSection === 'Profile' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Company Logo</label>
                    <div className="flex items-center space-x-6 px-3">
                      <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                        {(formData.profile.companyLogoPreview || formData.profile.companyLogo) ? (
                          <img
                            src={formData.profile.companyLogo ? URL.createObjectURL(formData.profile.companyLogo) : getImageUrl(formData.profile.companyLogoPreview)}
                            alt="Logo"
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <FiGlobe className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors inline-block">
                          Upload New Logo
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                setFormData({ ...formData, profile: { ...formData.profile, companyLogo: e.target.files[0] } });
                              }
                            }}
                          />
                        </label>
                        <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Recommended size: 256x256px.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Company Name</label>
                      <input
                        type="text"
                        value={formData.profile.company}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, company: e.target.value } })}
                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                      />
                    </div>
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
 
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Personal Bio</label>
                      <textarea
                        value={formData.profile.bio}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, bio: e.target.value } })}
                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] resize-none h-[49px]"
                        placeholder="Brief professional summary..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Currency</label>
                      <select
                        value={formData.profile.currency}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, currency: e.target.value } })}
                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] cursor-pointer"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.symbol} — {c.code} · {c.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-3">
                        Applied to all property prices on the website.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'Security' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={formData.security.currentPassword}
                        onChange={(e) => setFormData({ ...formData, security: { ...formData.security, currentPassword: e.target.value } })}
                        className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPasswords.current ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={formData.security.newPassword}
                          onChange={(e) => setFormData({ ...formData, security: { ...formData.security, newPassword: e.target.value } })}
                          className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPasswords.new ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={formData.security.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, security: { ...formData.security, confirmPassword: e.target.value } })}
                          className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPasswords.confirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
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
