import React, { useState, useEffect, useRef } from 'react';
import { FiSave, FiPlus, FiTrash2, FiInfo, FiUsers, FiTarget, FiAward, FiCheck, FiCamera, FiX, FiImage, FiEdit2 } from 'react-icons/fi';
import { aboutService } from '../../services/api';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import DeleteConfirmModal from './DeleteConfirmModal';

/* ── Reusable image upload picker ──────────────────────────────────────────── */
const ImagePicker = ({ preview, onFile, onClear, inputId, placeholder }) => (
  <div className="flex items-center gap-4">
    <div className="relative flex-shrink-0">
      {preview ? (
        <>
          <img src={preview} alt="preview" className="w-16 h-16 rounded-2xl object-cover border border-slate-100" />
          <button type="button" onClick={onClear}
            className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors">
            <FiX className="w-2.5 h-2.5" />
          </button>
        </>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
          <FiImage className="w-6 h-6" />
        </div>
      )}
    </div>
    <div className="flex-1">
      <input type="file" accept="image/*" id={inputId} className="hidden"
        onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
      <label htmlFor={inputId}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group">
        <FiCamera className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
        <span className="text-[10px] font-black text-slate-400 group-hover:text-primary uppercase tracking-widest transition-colors">
          {preview ? 'Change Photo' : (placeholder || 'Upload Photo')}
        </span>
      </label>
      <p className="text-[9px] text-slate-300 font-bold text-center mt-1.5">JPG, PNG, WEBP · Max 5MB</p>
    </div>
  </div>
);

/* ── Main component ─────────────────────────────────────────────────────────── */
const AboutManagement = () => {
  const [content, setContent] = useState({
    hero:    { title: '', subtitle: '', image: '' },
    mission: { title: '', description: '', image: '', points: [] },
    stats:   [],
    values:  [],
    team:    [],
  });
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [deleteModal, setDeleteModal]   = useState({ isOpen: false, type: '', index: null });
  const [memberModal, setMemberModal]   = useState({ isOpen: false, mode: 'add', index: null, name: '', role: '', file: null, preview: '' });

  // ── Image file state ─────────────────────────────────────────────────────
  // File uploads
  const [heroFile, setHeroFile]         = useState(null);
  const [heroPreview, setHeroPreview]   = useState('');
  
  const [missionFile, setMissionFile]   = useState(null);
  const [missionPreview, setMissionPreview] = useState('');
  
  const [teamFiles, setTeamFiles]       = useState([]);
  const [teamPreviews, setTeamPreviews] = useState([]);
  const heroInputRef = useRef(null);

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data } = await aboutService.getAboutContent();
      if (data.success) {
        const d = data.data || {};
        setContent({
          hero: { title: '', subtitle: '', image: '', ...(d.hero || {}) },
          mission: { title: '', description: '', image: '', points: [], ...(d.mission || {}) },
          stats: d.stats || [],
          values: d.values || [],
          team: d.team || []
        });
        setHeroPreview(getImageUrl(data.data.hero?.image) || '');
        setMissionPreview(getImageUrl(data.data.mission?.image) || '');
        
        const team = data.data.team || [];
        setTeamFiles(team.map(() => null));
        setTeamPreviews(team.map((m) => getImageUrl(m.image) || ''));
      }
    } catch (err) {
      console.error('Error fetching about content:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async (overrideContent = null, overrideHeroFile = undefined, overrideMissionFile = undefined, overrideTeamFiles = null, showSuccessToast = true) => {
    try {
      setSaving(true);
      
      // Prevent passing the SyntheticBaseEvent from onClick as the content object
      const isEvent = overrideContent && overrideContent.nativeEvent;
      const contentToSave = (overrideContent && !isEvent) ? overrideContent : content;
      const heroFileToSave = overrideHeroFile !== undefined && !isEvent ? overrideHeroFile : heroFile;
      const missionFileToSave = overrideMissionFile !== undefined && !isEvent ? overrideMissionFile : missionFile;
      const teamFilesToSave = (overrideTeamFiles && !isEvent) ? overrideTeamFiles : teamFiles;

      const fd = new FormData();
      fd.append('content', JSON.stringify(contentToSave));
      if (heroFileToSave) fd.append('heroImage', heroFileToSave);
      if (missionFileToSave) fd.append('missionImage', missionFileToSave);
      
      teamFilesToSave.forEach((file, i) => { if (file) fd.append(`teamImage_${i}`, file); });

      const { data } = await aboutService.updateAboutContent(fd);
      if (data.success) {
        const d = data.data || {};
        setContent({
          hero: { title: '', subtitle: '', image: '', ...(d.hero || {}) },
          mission: { title: '', description: '', image: '', points: [], ...(d.mission || {}) },
          stats: d.stats || [],
          values: d.values || [],
          team: d.team || []
        });
        
        // Only reset hero file if it wasn't overridden, or handle it based on new state properly
        if (overrideHeroFile === undefined) {
           setHeroFile(null);
        }
        if (overrideMissionFile === undefined) {
           setMissionFile(null);
        }

        setHeroPreview(getImageUrl(data.data.hero?.image) || '');
        setMissionPreview(getImageUrl(data.data.mission?.image) || '');
        const team = data.data.team || [];
        setTeamFiles(team.map(() => null));
        setTeamPreviews(team.map((m) => getImageUrl(m.image) || ''));
        if (showSuccessToast) {
          toast.success('About page updated successfully!');
        }
        return true;
      }
      return false;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating content');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Field helpers ─────────────────────────────────────────────────────────
  const updateHero    = (field, value) => setContent((c) => ({ ...c, hero:    { ...c.hero,    [field]: value } }));
  const updateMission = (field, value) => setContent((c) => ({ ...c, mission: { ...c.mission, [field]: value } }));

  const addPoint    = () => setContent((c) => ({ ...c, mission: { ...c.mission, points: [...c.mission.points, ''] } }));
  const updatePoint = (i, v) => setContent((c) => {
    const pts = [...c.mission.points]; pts[i] = v;
    return { ...c, mission: { ...c.mission, points: pts } };
  });

  const addStat    = () => setContent((c) => ({ ...c, stats: [...c.stats, { label: '', value: '', suffix: '' }] }));
  const updateStat = (i, field, value) => setContent((c) => {
    const s = [...c.stats]; s[i] = { ...s[i], [field]: value };
    return { ...c, stats: s };
  });

  const addValue    = () => setContent((c) => ({ ...c, values: [...c.values, { title: '', description: '', iconKey: 'FiAward' }] }));
  const updateValue = (i, field, val) => setContent((c) => {
    const v = [...c.values]; v[i] = { ...v[i], [field]: val };
    return { ...c, values: v };
  });

  const addTeam = () => {
    setMemberModal({ isOpen: true, mode: 'add', index: null, name: '', role: '', file: null, preview: '' });
  };
  
  const handleEditTeam = (index) => {
    const member = content.team[index];
    setMemberModal({
      isOpen: true,
      mode: 'edit',
      index,
      name: member.name,
      role: member.role,
      file: teamFiles[index],
      preview: teamPreviews[index]
    });
  };

  const handleSaveMember = async () => {
    if (!memberModal.name || !memberModal.role) {
      toast.error('Name and Role are required.');
      return;
    }

    let newContent = { ...content };
    let newTeamFiles = [...teamFiles];
    let newTeamPreviews = [...teamPreviews];

    if (memberModal.mode === 'add') {
      newContent.team = [...newContent.team, { name: memberModal.name, role: memberModal.role, image: '' }];
      newTeamFiles.push(memberModal.file);
      newTeamPreviews.push(memberModal.preview);
    } else {
      // Edit mode
      const i = memberModal.index;
      newContent.team = [...newContent.team]; // Create new array reference
      newContent.team[i] = { ...newContent.team[i], name: memberModal.name, role: memberModal.role };
      
      if (!memberModal.file && !memberModal.preview) {
        newContent.team[i].image = '';
      }
      
      newTeamFiles[i] = memberModal.file;
      newTeamPreviews[i] = memberModal.preview;
    }

    // Auto-save specifically to handle API update without page refresh
    const success = await handleSave(newContent, heroFile, missionFile, newTeamFiles, false);
    
    if (success) {
      toast.success(memberModal.mode === 'add' ? 'Member added successfully!' : 'Member updated successfully!');
      setMemberModal({ isOpen: false, mode: 'add', index: null, name: '', role: '', file: null, preview: '' });
    }
  };
  
  const updateTeam = (i, field, value) => setContent((c) => {
    const t = [...c.team]; t[i] = { ...t[i], [field]: value };
    return { ...c, team: t };
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteClick = (type, index) => setDeleteModal({ isOpen: true, type, index });

  const confirmDelete = async () => {
    const { type, index } = deleteModal;
    
    let newContent = { ...content };
    let newTeamFiles = [...teamFiles];
    let newTeamPreviews = [...teamPreviews];

    if (type === 'point') newContent.mission = { ...newContent.mission, points: newContent.mission.points.filter((_, i) => i !== index) };
    else if (type === 'stat') newContent.stats = newContent.stats.filter((_, i) => i !== index);
    else if (type === 'value') newContent.values = newContent.values.filter((_, i) => i !== index);
    else if (type === 'team') {
      newContent.team = newContent.team.filter((_, i) => i !== index);
      newTeamFiles = newTeamFiles.filter((_, i) => i !== index);
      newTeamPreviews = newTeamPreviews.filter((_, i) => i !== index);
    }
    
    setContent(newContent);
    if (type === 'team') {
      setTeamFiles(newTeamFiles);
      setTeamPreviews(newTeamPreviews);
    }
    
    setDeleteModal({ isOpen: false, type: '', index: null });

    // Auto-save deletion
    await handleSave(newContent, heroFile, missionFile, newTeamFiles, false);
    toast.success('Item removed successfully!');
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400">Loading Content Settings...</div>;

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">About Page</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Edit your company story and team members</p>
        </div>
        <button onClick={() => handleSave()} disabled={saving}
          className="bg-primary text-white px-8 py-3 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_60px_rgba(59,130,246,0.3)] hover:shadow-primary/50 transform hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center space-x-2">
          {saving
            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            : <><FiSave className="text-xl" /><span>Save Changes</span></>}
        </button>
      </div>

      <div className="space-y-16">
        {/* ── Hero Section ── */}
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
              <input type="text" value={content.hero.title} onChange={(e) => updateHero('title', e.target.value)}
                className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px]"
                placeholder="e.g. Dream Homes for Everyone" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Subtitle</label>
              <textarea value={content.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)}
                rows="4" className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-[13px] resize-none"
                placeholder="Write a short sub-headline..." />
            </div>
            {/* Hero Image Upload */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Hero Image</label>
              <ImagePicker
                preview={heroPreview}
                inputId="hero-image-upload"
                placeholder="Upload Hero Image"
                onFile={(file) => { setHeroFile(file); setHeroPreview(URL.createObjectURL(file)); }}
                onClear={() => { setHeroFile(null); setHeroPreview(''); updateHero('image', ''); }}
              />
            </div>
          </div>
        </div>

        {/* ── Mission Section ── */}
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
              <input type="text" value={content.mission.title} onChange={(e) => updateMission('title', e.target.value)}
                className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-[13px]" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Mission Text</label>
              <textarea value={content.mission.description} onChange={(e) => updateMission('description', e.target.value)}
                rows="5" className="w-full px-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-[13px] resize-none" />
            </div>
            {/* Mission Image Upload */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Mission Image</label>
              <ImagePicker
                preview={missionPreview}
                inputId="mission-image-upload"
                placeholder="Upload Mission Image"
                onFile={(file) => { setMissionFile(file); setMissionPreview(URL.createObjectURL(file)); }}
                onClear={() => { setMissionFile(null); setMissionPreview(''); updateMission('image', ''); }}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-3">Key Strategic Points</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.mission.points.map((point, index) => (
                  <div key={index} className="flex space-x-3 group">
                    <div className="relative flex-1">
                      <FiCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" />
                      <input type="text" value={point} onChange={(e) => updatePoint(index, e.target.value)}
                        className="w-full pl-10 pr-6 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-[13px]"
                        placeholder="Point of excellence..." />
                    </div>
                    <button onClick={() => handleDeleteClick('point', index)} className="w-12 h-12 bg-white border border-slate-100 text-rose-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={addPoint}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-[20px] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-500 transition-all flex items-center justify-center space-x-2">
                  <FiPlus /> <span>Add point</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Section ── */}
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
                    <input type="text" value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} className="w-full px-4 py-2 bg-white border-none rounded-lg font-bold text-slate-900 text-[13px] shadow-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Value</label>
                      <input type="number" value={stat.value} onChange={(e) => updateStat(index, 'value', parseInt(e.target.value))} className="w-full px-4 py-3 bg-white border-none rounded-xl font-bold text-slate-900 text-sm shadow-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Suffix</label>
                      <input type="text" value={stat.suffix} onChange={(e) => updateStat(index, 'suffix', e.target.value)} className="w-full px-4 py-3 bg-white border-none rounded-xl font-bold text-slate-900 text-sm shadow-sm" placeholder="e.g. +" />
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

        {/* ── Why Choose Us / Values Section ── */}
        <div className="bg-white p-7 md:p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shadow-inner">
                <FiAward className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Why Choose Us</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Values shown on the About page</p>
              </div>
            </div>
            <button onClick={addValue} className="group flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:shadow-xl transition-all">
              <FiPlus className="text-xs group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Value</span>
            </button>
          </div>

          <div className="space-y-4">
            {content.values.map((val, index) => (
              <div key={index} className="group relative bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-primary/20 transition-all">
                <button onClick={() => handleDeleteClick('value', index)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Title</label>
                    <input type="text" value={val.title}
                      onChange={(e) => updateValue(index, 'title', e.target.value)}
                      placeholder="e.g. Expert Guidance"
                      className="w-full px-4 py-2.5 bg-white border-none rounded-xl font-bold text-slate-900 text-[13px] shadow-sm focus:ring-4 focus:ring-primary/5" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Icon</label>
                    <select value={val.iconKey} onChange={(e) => updateValue(index, 'iconKey', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border-none rounded-xl font-bold text-slate-900 text-[13px] shadow-sm focus:ring-4 focus:ring-primary/5 cursor-pointer">
                      <option value="FiAward">🏆 Award</option>
                      <option value="FiUsers">👥 Users / Team</option>
                      <option value="FiTarget">🎯 Target / Goal</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Description</label>
                    <input type="text" value={val.description}
                      onChange={(e) => updateValue(index, 'description', e.target.value)}
                      placeholder="Brief description..."
                      className="w-full px-4 py-2.5 bg-white border-none rounded-xl font-bold text-slate-900 text-[13px] shadow-sm focus:ring-4 focus:ring-primary/5" />
                  </div>
                </div>
              </div>
            ))}
            {content.values.length === 0 && (
              <div className="py-12 text-center text-slate-300">
                <FiAward className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-black text-[10px] uppercase tracking-[0.2em]">No values added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Team Section ── */}
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 uppercase text-[10px] font-black tracking-widest text-slate-400">
                  <th className="py-4 px-6 min-w-[300px]">Team Member</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6 text-right w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.team.map((member, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 shadow-inner">
                          {teamPreviews[index] ? (
                            <img src={teamPreviews[index]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <FiUsers className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{member.name || 'Unnamed Member'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold shadow-sm">
                        {member.role || 'No Role Assigned'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleEditTeam(index)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick('team', index)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {content.team.length === 0 && (
              <div className="py-20 text-center text-slate-300 bg-slate-50/30 rounded-b-[32px] border-t border-dashed border-slate-100">
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
        title={`Remove ${deleteModal.type === 'point' ? 'Goal' : deleteModal.type === 'stat' ? 'Metric' : deleteModal.type === 'value' ? 'Value' : 'Member'}?`}
        message="Are you sure you want to remove this item? You'll need to save changes to make it permanent."
      />

      {/* Add/Edit Member Modal */}
      {memberModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {memberModal.mode === 'add' ? 'Add New Member' : 'Edit Member'}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                  Fill out member details
                </p>
              </div>
              <button onClick={() => setMemberModal({ ...memberModal, isOpen: false })} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Full Name <span className="text-rose-500">*</span></label>
                <input type="text" value={memberModal.name} onChange={(e) => setMemberModal({ ...memberModal, name: e.target.value })}
                  maxLength={50}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-sm" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Role <span className="text-rose-500">*</span></label>
                <input type="text" value={memberModal.role} onChange={(e) => setMemberModal({ ...memberModal, role: e.target.value })}
                  maxLength={50}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 text-sm" placeholder="e.g. Founder" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Photo</label>
                <ImagePicker
                  preview={memberModal.preview}
                  inputId="member-modal-image"
                  placeholder="Upload Member Photo"
                  onFile={(file) => setMemberModal({ ...memberModal, file, preview: URL.createObjectURL(file) })}
                  onClear={() => setMemberModal({ ...memberModal, file: null, preview: '' })}
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-4">
              <button onClick={() => setMemberModal({ ...memberModal, isOpen: false })} disabled={saving}
                className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700 transition-colors text-sm disabled:opacity-50">Cancel</button>
              <button onClick={handleSaveMember} disabled={saving}
                className="px-8 py-2.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 min-w-[140px] flex items-center justify-center disabled:opacity-50 disabled:hover:-translate-y-0">
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  memberModal.mode === 'add' ? 'Add Member' : 'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AboutManagement;
