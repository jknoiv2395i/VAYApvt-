'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import {
    Upload,
    FileText,
    Image,
    Trash2,
    Download,
    Search,
    Sparkles,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    Eye,
    X,
    FolderLock,
    Shield
} from 'lucide-react';

interface Document {
    id: string;
    filename: string;
    document_type: string;
    file_size: number;
    status: string;
    extracted_data?: any;
    created_at: string;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [extracting, setExtracting] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/documents/');
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFiles = async (files: File[]) => {
        for (const file of files) await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('document_type', detectDocumentType(file.name));

            const res = await fetch('http://localhost:8000/api/v1/documents/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) await fetchDocuments();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const extractData = async (docId: string) => {
        setExtracting(docId);
        try {
            const res = await fetch(`http://localhost:8000/api/v1/documents/${docId}/extract`, {
                method: 'POST',
            });
            if (res.ok) await fetchDocuments();
        } catch (error) {
            console.error('Extraction failed:', error);
        } finally {
            setExtracting(null);
        }
    };

    const deleteDocument = async (docId: string) => {
        if (!confirm('Delete this document?')) return;
        try {
            await fetch(`http://localhost:8000/api/v1/documents/${docId}`, { method: 'DELETE' });
            setDocuments(documents.filter(d => d.id !== docId));
        } catch (error) { console.error('Delete failed:', error); }
    };

    const detectDocumentType = (filename: string): string => {
        const lower = filename.toLowerCase();
        if (lower.includes('invoice')) return 'invoice';
        if (lower.includes('packing') || lower.includes('list')) return 'packing_list';
        if (lower.includes('bill') || lower.includes('lading')) return 'bill_of_lading';
        if (lower.includes('certificate')) return 'certificate';
        return 'other';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const filteredDocs = documents.filter(doc =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardWrapper>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                            <Shield className="w-6 h-6 text-[#FF5100]" />
                            Secure Vault
                        </h1>
                        <p className="text-gray-400 text-sm">Encrypted storage for sensitive trade documents</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="bg-[#121212] px-4 py-2 rounded-xl border border-white/5 text-sm text-gray-400">
                            {documents.length} Files Stored
                        </div>
                    </div>
                </div>

                {/* Upload Zone - "Drop Safe" Style */}
                <div
                    className={`relative overflow-hidden rounded-3xl border border-dashed transition-all duration-300 group ${dragActive ? 'border-[#FF5100] bg-[#FF5100]/5' : 'border-white/10 bg-[#121212] hover:border-[#FF5100]/50'}`}
                    onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
                    }}
                >
                    <input
                        type="file"
                        multiple
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    <div className="p-10 flex flex-col items-center justify-center text-center relative z-0">
                        {uploading ? (
                            <Loader2 className="w-12 h-12 text-[#FF5100] animate-spin mb-4" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg border border-white/5">
                                <Upload className="w-8 h-8 text-[#FF5100]" />
                            </div>
                        )}
                        <h3 className="text-xl font-medium text-white mb-2">Deposit Documents</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-sm">Drag invoices, packing lists, or certificates here to securely store and process them.</p>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                </div>

                {/* Search & Grid */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-300">Vault Contents</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search vault..."
                                className="bg-[#121212] border border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-[#FF5100]/50 w-64"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#FF5100] animate-spin" /></div>
                    ) : filteredDocs.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 border border-white/5 rounded-2xl bg-[#121212]">Vault is empty.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredDocs.map(doc => (
                                <div key={doc.id} className="bg-[#121212] rounded-2xl border border-white/5 p-6 hover:border-[#FF5100]/30 transition-all group hover:-translate-y-1 hover:shadow-xl relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] flex items-center justify-center">
                                            {doc.document_type === 'invoice' ? <FileText className="w-6 h-6 text-blue-400" /> : <FileText className="w-6 h-6 text-gray-400" />}
                                        </div>
                                        <div className="flex gap-1">
                                            {doc.status === 'extracted' ? (
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Processed" />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Processing" />
                                            )}
                                        </div>
                                    </div>

                                    <h4 className="text-white font-medium truncate mb-1" title={doc.filename}>{doc.filename}</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-6">{doc.document_type.replace('_', ' ')}</p>

                                    <div className="flex items-center gap-2 mt-auto">
                                        {doc.status !== 'extracted' && (
                                            <button
                                                onClick={() => extractData(doc.id)}
                                                disabled={extracting === doc.id}
                                                className="flex-1 py-2 bg-[#FF5100]/10 text-[#FF5100] rounded-lg text-xs font-bold uppercase hover:bg-[#FF5100]/20 transition-colors flex justify-center items-center gap-1"
                                            >
                                                {extracting === doc.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                                Extract
                                            </button>
                                        )}
                                        {doc.extracted_data && (
                                            <button
                                                onClick={() => setPreviewDoc(doc)}
                                                className="flex-1 py-2 bg-white/5 text-white rounded-lg text-xs font-bold uppercase hover:bg-white/10 transition-colors"
                                            >
                                                View Data
                                            </button>
                                        )}
                                        <button onClick={() => deleteDocument(doc.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#121212] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1A1A1A]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#FF5100]" />
                                Extracted Intelligence
                            </h3>
                            <button onClick={() => setPreviewDoc(null)}><X className="w-6 h-6 text-gray-500 hover:text-white" /></button>
                        </div>
                        <div className="p-8 overflow-auto">
                            <pre className="text-xs font-mono text-gray-300 bg-black p-4 rounded-xl border border-white/5 overflow-x-auto">
                                {JSON.stringify(previewDoc.extracted_data, null, 2)}
                            </pre>

                            <div className="mt-8">
                                <Link
                                    href="/cbam"
                                    className="block w-full py-4 bg-[#FF5100] text-white font-bold text-center rounded-xl hover:bg-[#ff6a26] transition-colors shadow-[0_4px_20px_rgba(255,81,0,0.3)]"
                                >
                                    Generate Report from this Data
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardWrapper>
    );
}
