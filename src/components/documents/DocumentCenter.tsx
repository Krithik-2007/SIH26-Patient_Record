import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { MedicalDocument, DocumentType } from '../../types';
import { DocumentUploader } from './DocumentUploader';
import { DocumentViewer } from './DocumentViewer';
import { GlassPanel } from '../common/GlassPanel';
import { Badge } from '../common/Badge';
import { 
  FileText, 
  Search, 
  Filter, 
  Sparkles, 
  Upload, 
  Download, 
  Eye, 
  Calendar, 
  Building2,
  Stethoscope,
  Plus,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { clsx } from 'clsx';

export const DocumentCenter: React.FC = () => {
  const { documents, incidents, confirmExtractedDocumentData } = usePatient();
  
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [showUploader, setShowUploader] = useState(false);

  const documentTypes: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Documents' },
    { id: 'PRESCRIPTION', label: 'Prescriptions' },
    { id: 'LAB_REPORT', label: 'Lab Reports' },
    { id: 'IMAGING_SCAN', label: 'Radiographs & Scans' },
    { id: 'DISCHARGE_SUMMARY', label: 'Discharge Summaries' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.extractedData?.doctorName && doc.extractedData.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedType === 'ALL') return matchesSearch;
    return matchesSearch && doc.type === selectedType;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Encrypted Medical Vault</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">{documents.length} Verified Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Medical Document Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            OCR-digitized diagnostic reports, prescriptions, X-rays, and clinical summaries.
          </p>
        </div>

        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-teal to-cyan-500 text-slate-950 font-extrabold text-xs shadow-glow-teal hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>{showUploader ? 'Close Uploader' : '+ Upload Medical Document'}</span>
        </button>
      </div>

      {/* Conditional Inline Uploader */}
      {showUploader && (
        <DocumentUploader onSuccess={() => setShowUploader(false)} />
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#090d16]/80 border border-white/[0.08] backdrop-blur-xl shadow-spatial-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records by title, doctor name, test type, or Incident ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f1524] border border-white/[0.07] rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {documentTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={clsx(
                "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                selectedType === t.id
                  ? "bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-glow-cyan"
                  : "bg-white/[0.03] text-slate-400 hover:text-white border border-transparent"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map(doc => {
          const linkedInc = incidents.find(i => i.id === doc.incidentId);

          return (
            <GlassPanel
              key={doc.id}
              variant="base"
              className="p-5 flex flex-col justify-between group hover:border-brand-cyan/40 transition-all cursor-pointer shadow-spatial-sm hover:shadow-spatial-md"
              onClick={() => setSelectedDoc(doc)}
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-lg bg-black/40 border border-white/10 text-brand-cyan font-bold">
                    {doc.incidentId}
                  </span>
                  <Badge source="AI_EXTRACTED" />
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors line-clamp-1 mb-1">
                  {doc.title}
                </h4>

                <p className="text-[11px] text-slate-400 font-mono mb-3">
                  {doc.filename} • {doc.fileSize}
                </p>

                {/* Extracted Details Snippet */}
                {doc.extractedData?.doctorName && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-2">
                    <Stethoscope className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>{doc.extractedData.doctorName}</span>
                  </div>
                )}

                {linkedInc && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{linkedInc.hospital}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  {doc.uploadDate}
                </span>

                <span className="flex items-center gap-1 text-brand-cyan text-[11px] font-bold group-hover:translate-x-1 transition-transform">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect OCR Data</span>
                </span>
              </div>
            </GlassPanel>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#090d16] border border-white/10 text-slate-400 text-xs">
          No medical records found matching your filter criteria.
        </div>
      )}

      {/* Document Inspection & Verification Modal */}
      <DocumentViewer
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onConfirmExtraction={(docId, data) => confirmExtractedDocumentData(docId, data)}
      />
    </div>
  );
};
