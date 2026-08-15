import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { MediaFile } from '../../types';
import { Image, Upload, Trash2, Copy, CheckCircle2, FileText } from 'lucide-react';

export const MediaManager: React.FC = () => {
  const { mediaFiles, addMediaFile, deleteMediaFile } = useCMS();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  const handleUpload = () => {
    if (!uploadName || !uploadUrl) return;
    addMediaFile({
      name: uploadName,
      url: uploadUrl,
      folder: 'diagrams',
      fileType: 'image',
      sizeBytes: 1200000,
      altText: uploadName,
    });
    setUploadName('');
    setUploadUrl('');
  };

  const handleCopyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Media Assets CMS</h2>
          <p className="text-xs text-slate-500">Manage uploaded images, diagram assets, file sizes, and alt text.</p>
        </div>
      </div>

      {/* Upload Simulation Card */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-indigo-500" /> Upload New Asset URL
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="File Name (e.g. redis_architecture_diagram.png)"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
          />
          <input
            type="text"
            placeholder="Image Asset URL (https://...)"
            value={uploadUrl}
            onChange={(e) => setUploadUrl(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
          />
        </div>

        <button
          onClick={handleUpload}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" /> Save Asset to Storage
        </button>
      </div>

      {/* Media Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaFiles.map((media) => (
          <div
            key={media.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 group hover:border-indigo-500/40 transition-colors"
          >
            <div className="h-32 w-full bg-slate-950 rounded-xl overflow-hidden relative">
              <img
                src={media.url}
                alt={media.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {media.name}
              </h4>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                {(media.sizeBytes / (1024 * 1024)).toFixed(1)} MB • {media.fileType}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleCopyUrl(media)}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
              >
                {copiedId === media.id ? (
                  <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Copied!</span>
                ) : (
                  <><Copy className="w-3 h-3" /> Copy URL</>
                )}
              </button>

              <button
                onClick={() => deleteMediaFile(media.id)}
                className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
