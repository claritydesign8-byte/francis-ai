import React from 'react';
import { X, Smartphone, Monitor, Download } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  canInstall: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({ 
  isOpen, 
  onClose, 
  onInstall,
  canInstall 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Get Francis-AI</h3>
              <p className="text-sm text-slate-500 mt-1">Experience the full power of AI on all your devices.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {/* iOS App Store - Simulated */}
            <button 
              onClick={() => alert("The iOS app is coming soon to the App Store!")}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
                   <Smartphone size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">App Store</div>
                  <div className="text-xs text-slate-500">Download for iOS</div>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-primary-600">Coming Soon</span>
            </button>

            {/* Google Play Store - Simulated */}
            <button 
              onClick={() => alert("The Android app is coming soon to the Play Store!")}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3DDC84] text-white rounded-lg flex items-center justify-center">
                   <Smartphone size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">Google Play</div>
                  <div className="text-xs text-slate-500">Download for Android</div>
                </div>
              </div>
               <span className="text-xs font-medium text-slate-400 group-hover:text-primary-600">Coming Soon</span>
            </button>

            {/* Web Install */}
            <button 
              onClick={() => {
                if (canInstall) {
                  onInstall();
                } else {
                  alert("To install, tap 'Share' then 'Add to Home Screen' in your browser menu.");
                }
              }}
              className="w-full flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center">
                   <Monitor size={20} />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-primary-900">Install Web App</div>
                  <div className="text-xs text-primary-700">Add to Home Screen</div>
                </div>
              </div>
              <Download size={18} className="text-primary-500 group-hover:text-primary-700" />
            </button>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Francis-AI synchronizes your history across all platforms.
          </p>
        </div>
      </div>
    </div>
  );
};