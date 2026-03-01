import React from 'react';
import { createPortal } from 'react-dom';
import { FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title = "Delete Item?", message = "Are you sure you want to delete this? This action cannot be undone." }) => {
  if (!isOpen) return null;

  const modalRoot = document.body;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 w-screen h-screen">
      {/* Glassy Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl transition-opacity duration-500"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-[400px] bg-white/80 backdrop-blur-2xl rounded-[40px] border border-white/20 shadow-[0_32px_128px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 to-orange-500"></div>

        <div className="p-8">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100/50 transition-all duration-300"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Icon Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <FiTrash2 className="w-10 h-10 text-white -rotate-12" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {title}
            </h2>
            <div className="pt-1">
              <p className="text-[13px] font-bold text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                {message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] shadow-xl shadow-rose-500/20 hover:bg-rose-600 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Delete now</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 bg-white/50 hover:bg-white text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all duration-300 border border-slate-200/50"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Subtle Footer Decorations */}
        <div className="bg-white/30 py-4 px-8 flex justify-between items-center border-t border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Permanent Action</span>
          </div>
          <div className="flex space-x-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-1 h-1 rounded-full bg-slate-200`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default DeleteConfirmModal;
