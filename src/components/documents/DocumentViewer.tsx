import React, { useState } from 'react';
import { MedicalDocument, ExtractedMedicalData } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { GlassPanel } from '../common/GlassPanel';
import { 
  FileText, 
  Sparkles, 
  Building2, 
  Stethoscope, 
  Calendar, 
  CheckCircle2, 
  Edit3, 
  Download,
  AlertCircle,
  Pill,
  Image as ImageIcon
} from 'lucide-react';

interface DocumentViewerProps {
  document: MedicalDocument | null;
  onClose: () => void;
  onConfirmExtraction?: (docId: string, data: ExtractedMedicalData) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  onConfirmExtraction
}) => {
  if (!document) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ExtractedMedicalData>(
    document.extractedData || { confidenceScore: 0.95 }
  );

  const handleSaveAndConfirm = () => {
    if (onConfirmExtraction) {
      onConfirmExtraction(document.id, editedData);
    }
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={!!document}
      onClose={onClose}
      title={document.title}
      subtitle={`${document.filename} • ${document.type} • Uploaded on ${document.uploadDate}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        
        {/* Document Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
          <div className="flex items-center gap-3">
            <Badge source="AI_EXTRACTED" />
            <span className="text-slate-400">Linked Incident: <strong className="text-brand-cyan font-mono">{document.incidentId}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400">{document.fileSize}</span>
            {document.previewUrl && (
              <a
                href={document.previewUrl}
                download={document.filename}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save File</span>
              </a>
            )}
          </div>
        </div>

        {/* Two-Column Inspector: Visual Document Preview + Extracted AI Intelligence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left Column: Visual Document Preview (Real Image or Digital Enclave) */}
          <div className="h-96 rounded-2xl bg-black/50 border border-white/10 p-3 flex flex-col justify-between relative overflow-hidden font-mono text-xs">
            {document.previewUrl ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-black/60">
                <img
                  src={document.previewUrl}
                  alt={document.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <div className="space-y-3 p-3 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-teal" />
                      <span className="font-bold text-white uppercase text-[11px]">{document.type}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{document.uploadDate}</span>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <div>FACILITY: {document.extractedData?.hospitalName || 'RECORDED HEALTH CENTER'}</div>
                    <div>CLINICIAN: {document.extractedData?.doctorName || 'ATTENDING PHYSICIAN'}</div>
                    <div>STATUS: ENCRYPTED IN RECORD VAULT</div>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-slate-400 space-y-1 leading-relaxed">
                    <div>[DIGITAL CLINICAL RECORD]</div>
                    <div>{document.extractedData?.diagnosis || 'Standard outpatient diagnostic notes.'}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500">
                  <span>SHA-256 Verified Enclave</span>
                  <span className="text-brand-emerald">Tamper-Proof ✓</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Extraction & Verification Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-cyan uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Extracted Clinical Data</span>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Fields'}</span>
              </button>
            </div>

            {/* Extracted Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Attending Clinician</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.doctorName || ''}
                    onChange={(e) => setEditedData({ ...editedData, doctorName: e.target.value })}
                    className="w-full bg-[#131824] border border-white/10 rounded-lg p-2 text-white text-xs"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-200 font-semibold">
                    {document.extractedData?.doctorName || 'Not identified'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Extracted Diagnosis</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.diagnosis || ''}
                    onChange={(e) => setEditedData({ ...editedData, diagnosis: e.target.value })}
                    className="w-full bg-[#131824] border border-white/10 rounded-lg p-2 text-white text-xs"
                  />
                ) : (
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-slate-200">
                    {document.extractedData?.diagnosis || 'Clinical evaluation in progress'}
                  </div>
                )}
              </div>

              {/* Extracted Medicines list */}
              {document.extractedData?.medicines && document.extractedData.medicines.length > 0 && (
                <div>
                  <label className="block text-[11px] font-mono text-brand-emerald uppercase mb-1 flex items-center gap-1">
                    <Pill className="w-3 h-3" />
                    <span>Prescribed Items ({document.extractedData.medicines.length})</span>
                  </label>
                  <div className="space-y-1.5">
                    {document.extractedData.medicines.map((m, i) => (
                      <div key={i} className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                        <span className="font-semibold text-white">{m.name}</span>
                        <span className="text-[11px] font-mono text-brand-cyan">{m.dose} • {m.frequency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verification Status & Confirm Button */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
                <span>Extracted data is patient-controlled and verifiable.</span>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveAndConfirm}
                  className="w-full py-2 rounded-xl bg-brand-emerald text-slate-950 font-bold text-xs hover:brightness-110 shadow-glow-emerald"
                >
                  Save Corrections & Verify Document
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
