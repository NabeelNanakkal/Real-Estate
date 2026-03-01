import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiInfo, FiUsers, FiTarget, FiAward, FiCheck } from 'react-icons/fi';
import { aboutService } from '../../services/api';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const AboutManagement = () => {
  const [content, setContent] = useState({
    hero: { title: '', subtitle: '', image: '' },
    mission: { title: '', description: '', image: '', points: [] },
    stats: [],
    values: [],
    team: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', index: null });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data } = await aboutService.getAboutContent();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await aboutService.updateAboutContent(content);
      if (data.success) {
        toast.success('About page updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating content');
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field, value) => {
    setContent({ ...content, hero: { ...content.hero, [field]: value } });
  };

  const updateMission = (field, value) => {
    setContent({ ...content, mission: { ...content.mission, [field]: value } });
  };

  const addPoint = () => {
    setContent({
      ...content,
      mission: { ...content.mission, points: [...content.mission.points, ''] }
    });
  };

  const updatePoint = (index, value) => {
    const newPoints = [...content.mission.points];
    newPoints[index] = value;
    setContent({
      ...content,
      mission: { ...content.mission, points: newPoints }
    });
  };

  const addStat = () => {
    setContent({
      ...content,
      stats: [...content.stats, { label: '', value: '', suffix: '' }]
    });
  };

  const updateStat = (index, field, value) => {
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
  };

  const addTeam = () => {
    setContent({
      ...content,
      team: [...content.team, { name: '', role: '', image: '' }]
    });
  };

  const updateTeam = (index, field, value) => {
    const newTeam = [...content.team];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setContent({ ...content, team: newTeam });
  };

  const handleDeleteClick = (type, index) => {
    setDeleteModal({ isOpen: true, type, index });
  };

  const confirmDelete = () => {
    const { type, index } = deleteModal;
    let newContent = { ...content };

    if (type === 'point') {
      newContent.mission.points = content.mission.points.filter((_, i) => i !== index);
    } else if (type === 'stat') {
      newContent.stats = content.stats.filter((_, i) => i !== index);
    } else if (type === 'team') {
      newContent.team = content.team.filter((_, i) => i !== index);
    }

    setContent(newContent);
    setDeleteModal({ isOpen: false, type: '', index: null });
    toast.success('Item removed from draft');
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Content Settings...</div>;

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">About Page</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Edit your company story and team members</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-8 py-3 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_60px_rgba(59,130,246,0.3)] hover:shadow-primary/50 transform hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center space-x-2"
        >
          {saving ? (
             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <FiSave className="text-xl" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-16">
        {/* Hero Section */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50"></div>
          
          <div className="flex items-center space-x-3 mb-8 relative">
            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner">
              <FiInfo className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Main Header</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Show the main title and welcome text</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 relative">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3">Title</label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) => updateHero('title', e.target.value)}
                className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                placeholder="e.g. Dream Homes for Everyone"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Subtitle</label>
              <textarea
                value={content.hero.subtitle}
                onChange={(e) => updateHero('subtitle', e.target.value)}
                rows="4"
                className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] resize-none"
                placeholder="Write a short sub-headline..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Image URL</label>
              <input
                type="text"
                value={content.hero.image}
                onChange={(e) => updateHero('image', e.target.value)}
                className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-50"></div>
          
          <div className="flex items-center space-x-3 mb-8 relative">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shadow-inner">
              <FiTarget className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Our Mission</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Our goals and what we believe in</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 relative">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Mission Title</label>
              <input
                type="text"
                value={content.mission.title}
                onChange={(e) => updateMission('title', e.target.value)}
                className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-[13px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Mission Text</label>
              <textarea
                value={content.mission.description}
                onChange={(e) => updateMission('description', e.target.value)}
                rows="5"
                className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-[13px] resize-none"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3">Key Strategic Points</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.mission.points.map((point, index) => (
                  <div key={index} className="flex space-x-3 group">
                    <div className="relative flex-1">
                        <FiCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input
                            type="text"
                            value={point}
                            onChange={(e) => updatePoint(index, e.target.value)}
                            className="w-full pl-10 pr-6 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-[13px]"
                            placeholder="Point of excellence..."
                        />
                    </div>
                    <button onClick={() => handleDeleteClick('point', index)} className="w-12 h-12 bg-white border border-slate-100 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addPoint}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-[20px] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-500 transition-all flex items-center justify-center space-x-2"
                >
                  <FiPlus /> <span>Add point</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shadow-inner">
                <FiAward className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Company Stats</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Numbers that show our success</p>
              </div>
            </div>
            <button onClick={addStat} className="group flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:shadow-xl transition-all">
                <FiPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" />
                <span>Add Metric</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.stats.map((stat, index) => (
              <div key={index} className="p-8 bg-slate-50/50 rounded-[40px] relative group border-2 border-transparent hover:border-orange-100 hover:bg-white transition-all duration-500">
                <button onClick={() => handleDeleteClick('stat', index)} className="absolute top-6 right-6 w-8 h-8 bg-white border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Display Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      className="w-full px-4 py-2 bg-white border-none rounded-lg font-bold text-slate-900 text-[13px] shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Value</label>
                      <input
                        type="number"
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-white border-none rounded-xl font-bold text-slate-900 text-sm shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Suffix</label>
                      <input
                        type="text"
                        value={stat.suffix}
                        onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                        className="w-full px-4 py-3 bg-white border-none rounded-xl font-bold text-slate-900 text-sm shadow-sm"
                        placeholder="e.g. +"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {content.stats.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-300">
                    <p className="font-black text-[10px] uppercase tracking-[0.2em]">No metrics currently archived</p>
                </div>
            )}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shadow-inner">
                <FiUsers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Our Team</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Meet the people behind your company</p>
              </div>
            </div>
            <button onClick={addTeam} className="group flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:shadow-xl transition-all">
                <FiPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" />
                <span>Add Member</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.team.map((member, index) => (
              <div key={index} className="p-7 bg-slate-50/50 rounded-[32px] border-2 border-transparent hover:border-purple-100 hover:bg-white transition-all duration-700 group">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative shadow-xl group-hover:scale-105 transition-transform duration-500 border-2 border-white">
                    {member.image ? (
                      <img src={member.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><FiUsers className="w-8 h-8" /></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeam(index, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border-none rounded-lg font-bold text-slate-900 text-[13px] shadow-sm"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Role</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => updateTeam(index, 'role', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border-none rounded-lg font-bold text-slate-900 text-[13px] shadow-sm"
                        placeholder="e.g. Founder"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Photo URL</label>
                      <input
                        type="text"
                        value={member.image}
                        onChange={(e) => updateTeam(index, 'image', e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border-none rounded-lg font-bold text-slate-900 text-[13px] shadow-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <button 
                        onClick={() => handleDeleteClick('team', index)} 
                        className="w-full py-2.5 text-rose-500 font-black text-[9px] uppercase tracking-widest bg-rose-50/50 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Remove Member
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {content.team.length === 0 && (
                 <div className="col-span-full py-20 text-center text-slate-300 bg-slate-50/30 rounded-[48px] border-2 border-dashed border-slate-100">
                    <FiUsers className="w-16 h-16 mx-auto mb-6 opacity-20" />
                    <p className="font-black text-xs uppercase tracking-[0.3em]">No team members found</p>
                 </div>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '', index: null })}
        onConfirm={confirmDelete}
        title={`Remove ${deleteModal.type === 'point' ? 'Goal' : deleteModal.type === 'stat' ? 'Metric' : 'Member'}?`}
        message="Are you sure you want to remove this item? You'll need to save changes to make it permanent."
      />
    </div>
  );
};

export default AboutManagement;
