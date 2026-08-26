import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { GlassPanel } from '../common/GlassPanel';
import { Upload, Sparkles, CheckCircle2, FileText, X, Image as ImageIcon, Plus } from 'lucide-react';

interface DocumentUploaderProps {
  onSuccess?: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onSuccess }) => {
  const { incidents, uploadMultipleDocuments } = usePatient();
  const [selectedIncidentId, setSelectedIncidentId] = useState(incidents[0]?.id || 'INC-001');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string }[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'IDLE' | 'UPLOADING' | 'ANALYZING' | 'DONE'>('IDLE');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartBatchUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploadStatus('UPLOADING');
    setTimeout(async () => {
      setUploadStatus('ANALYZING');
      setTimeout(async () => {
        const rawFiles = selectedFiles.map(f => f.file);
        await uploadMultipleDocuments(rawFiles, selectedIncidentId);
        setUploadStatus('DONE');
        setTimeout(() => {
          setSelectedFiles([]);
          setUploadStatus('IDLE');
          if (onSuccess) onSuccess();
        }, 1200);
      }, 1000);
    }, 800);
  };

  return (
    <GlassPanel variant="base" className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Upload Health Documents (Batch & Multi-File)</h3>
          <p className="text-xs text-slate-400">Select multiple X-rays, prescriptions, clinical photos, or lab reports at once.</p>
        </div>
        
        {/* Link to Incident Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Link to:</span>
          <select
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="bg-[#131824] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-brand-cyan font-mono focus:outline-none"
          >
            {incidents.map(inc => (
              <option key={inc.id} value={inc.id}>{inc.id} - {inc.title.substring(0, 20)}...</option>
            ))}
            {incidents.length === 0 && <option value="INC-001">INC-001 - Current Episode</option>}
          </select>
        </div>
      </div>

      {/* Multi-File Upload Zone */}
      <div
        onDragOver={() => setIsHovered(true)}
        onDragLeave={() => setIsHovered(false)}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
          isHovered ? 'border-brand-teal bg-brand-teal/5' : 'border-white/15 bg-black/20 hover:border-white/30'
        }`}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.dcm"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-cyan shadow-glow-teal">
            <Upload className="w-6 h-6" />
          </div>
          <div className="text-xs font-bold text-white mt-1">
            Choose files or drag & drop multiple files here
          </div>
          <p className="text-[11px] text-slate-400">
            Supports multiple JPG, PNG, PDF, DICOM up to 25MB each
          </p>
        </div>
      </div>

      {/* Selected Files Preview Grid */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400">Selected Files ({selectedFiles.length}):</span>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-slate-500 hover:text-slate-300 underline text-[11px]"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedFiles.map((item, idx) => (
              <div key={idx} className="relative rounded-xl bg-[#131824] border border-white/10 p-2 group overflow-hidden text-xs">
                {/* Thumbnail Preview */}
                {item.preview ? (
                  <div className="w-full h-24 rounded-lg overflow-hidden mb-1.5 bg-black/40">
                    <img src={item.preview} alt={item.file.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-24 rounded-lg flex items-center justify-center bg-black/40 text-brand-cyan mb-1.5">
                    <FileText className="w-8 h-8" />
                  </div>
                )}

                <div className="font-semibold text-white truncate text-[11px]">{item.file.name}</div>
                <div className="text-[10px] text-slate-500 font-mono">{(item.file.size / (1024 * 1024)).toFixed(1)} MB</div>

                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 hover:bg-brand-rose text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleStartBatchUpload}
              disabled={uploadStatus !== 'IDLE'}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-teal hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
            >
              {uploadStatus === 'UPLOADING' && <Sparkles className="w-4 h-4 animate-spin" />}
              {uploadStatus === 'ANALYZING' && <Sparkles className="w-4 h-4 animate-pulse" />}
              {uploadStatus === 'DONE' && <CheckCircle2 className="w-4 h-4" />}
              <span>
                {uploadStatus === 'UPLOADING'
                  ? `Encrypting ${selectedFiles.length} file(s)...`
                  : uploadStatus === 'ANALYZING'
                  ? 'AI Document OCR Analysis in Progress...'
                  : uploadStatus === 'DONE'
                  ? 'Batch Extraction Complete!'
                  : `Upload & Extract ${selectedFiles.length} Document(s)`}
              </span>
            </button>
          </div>
        </div>
      )}
    </GlassPanel>
  );
};
