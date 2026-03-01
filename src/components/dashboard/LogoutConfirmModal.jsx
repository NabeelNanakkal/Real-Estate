import React from 'react';
import { FiLogOut, FiX } from 'react-icons/fi';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-500"
        
      ></div>

      {/* Modal Content - Glassy Effect */}
      <div className="relative bg-white/80 backdrop-blur-xl w-full max-w-sm rounded-[32px] shadow-[0_20px_70px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 pb-10">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-white/40">
              <FiLogOut className="w-6 h-6" />
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-xl transition-all"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Log out?
            </h3>
            <p className="text-[13px] font-bold text-slate-500 leading-relaxed">
              Are you sure you want to log out? Any unsaved changes will be lost.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full bg-rose-500 text-white px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all flex items-center justify-center space-x-2"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white/50 text-slate-600 px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white/80 transition-all border border-white/50"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="bg-white/30 p-4 border-t border-white/20 flex items-center justify-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Logout</span>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
