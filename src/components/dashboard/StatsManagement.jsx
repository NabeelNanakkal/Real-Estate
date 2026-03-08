import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiEdit2, FiHome, FiUsers, FiMapPin, FiTrendingUp, FiStar, FiAward, FiTarget, FiGlobe, FiBarChart2, FiCheck, FiX } from 'react-icons/fi';
import { statsService } from '../../services/api';
import toast from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const ICON_OPTIONS = [
  { key: 'FiHome', icon: FiHome },
  { key: 'FiUsers', icon: FiUsers },
  { key: 'FiMapPin', icon: FiMapPin },
  { key: 'FiTrendingUp', icon: FiTrendingUp },
  { key: 'FiStar', icon: FiStar },
  { key: 'FiAward', icon: FiAward },
  { key: 'FiTarget', icon: FiTarget },
  { key: 'FiGlobe', icon: FiGlobe },
  { key: 'FiBarChart2', icon: FiBarChart2 },
];

const COLOR_OPTIONS = [
  { label: 'Blue',   value: 'bg-blue-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Green',  value: 'bg-emerald-500' },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Red',    value: 'bg-red-500' },
  { label: 'Pink',   value: 'bg-pink-500' },
  { label: 'Teal',   value: 'bg-teal-500' },
  { label: 'Indigo', value: 'bg-indigo-500' },
];

const emptyForm = { label: '', value: '', suffix: '+', iconKey: 'FiTrendingUp', color: 'bg-blue-500' };

const StatForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || emptyForm);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="p-6 bg-slate-50 rounded-[24px] border-2 border-primary/20 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Label</label>
          <input
            type="text"
            value={form.label}
            onChange={e => set('label', e.target.value)}
            className="w-full px-5 py-3 bg-white rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 outline-none text-[13px] shadow-sm"
            placeholder="e.g. Happy Clients"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Value</label>
            <input
              type="number"
              min="0"
              value={form.value}
              onChange={e => set('value', e.target.value)}
              className="w-full px-5 py-3 bg-white rounded-xl font-black text-slate-900 focus:ring-4 focus:ring-primary/5 outline-none text-xl shadow-sm"
              placeholder="500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Suffix</label>
            <input
              type="text"
              value={form.suffix}
              onChange={e => set('suffix', e.target.value)}
              className="w-full px-5 py-3 bg-white rounded-xl font-bold text-slate-900 focus:ring-4 focus:ring-primary/5 outline-none text-[13px] shadow-sm"
              placeholder="+ or %"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Icon</label>
        <div className="flex flex-wrap gap-2">
          {ICON_OPTIONS.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => set('iconKey', key)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.iconKey === key ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-3">Color</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => set('color', value)}
              className={`w-8 h-8 rounded-lg ${value} flex items-center justify-center transition-all ${form.color === value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-70 hover:opacity-100'}`}
            >
              {form.color === value && <FiCheck className="w-3 h-3 text-white" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
          <FiX className="w-3.5 h-3.5" /><span>Cancel</span>
        </button>
        <button type="button" onClick={() => onSave(form)} className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all">
          <FiCheck className="w-3.5 h-3.5" /><span>Save Stat</span>
        </button>
      </div>
    </div>
  );
};

const StatsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await statsService.getStats();
      if (data.success) setStats(data.data);
    } catch {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (form) => {
    try {
      const { data } = await statsService.addStat({ ...form, value: Number(form.value) });
      if (data.success) { setStats(data.data); setShowAddForm(false); toast.success('Stat added!'); }
    } catch { toast.error('Failed to add stat'); }
  };

  const handleUpdate = async (id, form) => {
    try {
      const { data } = await statsService.updateStat(id, { ...form, value: Number(form.value) });
      if (data.success) { setStats(data.data); setEditingId(null); toast.success('Stat updated!'); }
    } catch { toast.error('Failed to update stat'); }
  };

  const handleDelete = async () => {
    try {
      const { data } = await statsService.deleteStat(deleteModal.id);
      if (data.success) { setStats(data.data); toast.success('Stat deleted!'); }
    } catch { toast.error('Failed to delete stat'); }
    finally { setDeleteModal({ isOpen: false, id: null }); }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading Stats...</div>;

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Stats Section</h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Control the numbers shown on the homepage</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingId(null); }}
          className="flex items-center space-x-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all group"
        >
          <FiPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Stat</span>
        </button>
      </div>

      <div className="bg-white/60 border border-slate-100 rounded-[20px] p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
        "Portfolio Assets" is auto-calculated from your total published properties and always appears first.
      </div>

      {showAddForm && (
        <StatForm onSave={handleAdd} onCancel={() => setShowAddForm(false)} />
      )}

      <div className="space-y-4">
        {stats.length === 0 && !showAddForm && (
          <div className="py-20 text-center text-slate-300">
            <FiBarChart2 className="w-16 h-16 mx-auto mb-6 opacity-20" />
            <p className="font-black text-xs uppercase tracking-[0.3em]">No stats yet. Add your first one.</p>
          </div>
        )}

        {stats.map((stat) => {
          const Icon = ICON_OPTIONS.find(i => i.key === stat.iconKey)?.icon || FiTrendingUp;
          if (editingId === stat._id) {
            return (
              <StatForm
                key={stat._id}
                initial={stat}
                onSave={(form) => handleUpdate(stat._id, form)}
                onCancel={() => setEditingId(null)}
              />
            );
          }
          return (
            <div key={stat._id} className="flex items-center justify-between p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}{stat.suffix}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingId(stat._id); setShowAddForm(false); }}
                  className="w-9 h-9 bg-slate-50 hover:bg-primary hover:text-white text-slate-400 rounded-xl flex items-center justify-center transition-all"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, id: stat._id })}
                  className="w-9 h-9 bg-slate-50 hover:bg-rose-500 hover:text-white text-slate-400 rounded-xl flex items-center justify-center transition-all"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Stat?"
        message="Are you sure you want to remove this stat from the homepage?"
      />
    </div>
  );
};

export default StatsManagement;
