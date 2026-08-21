import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PHP_PROJECT_FILES } from '../data/phpProjectData';
import { PHPFileItem } from '../types';
import { Code, Download, Copy, Check, FileText, Database, Server, Terminal, X, ExternalLink, HelpCircle } from 'lucide-react';

interface PHPCodeViewerProps {
  onClose: () => void;
}

export const PHPCodeViewer: React.FC<PHPCodeViewerProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<PHPFileItem>(PHP_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'setup'>('code');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = () => {
    window.location.href = '/api/export-php-zip';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900 max-w-6xl w-full rounded-2xl border border-slate-800 shadow-2xl flex flex-col h-[90vh] overflow-hidden text-slate-200"
      >
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" /> PHP 8 + MySQL Project Source Code Explorer
            </h2>
            <p className="text-xs text-slate-400">
              100% complete academic source code package ready for XAMPP / Apache deployment.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleDownloadZip}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> Download Complete ZIP
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 flex gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'code' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" /> Source Code Files ({PHP_PROJECT_FILES.length})
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'setup' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" /> XAMPP Setup & MySQL Import Guide
          </button>
        </div>

        {/* Main Body */}
        {activeTab === 'code' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* File List Sidebar */}
            <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 p-3 overflow-y-auto space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 px-2 block mb-1">
                Project Files Tree
              </span>
              {PHP_PROJECT_FILES.map(file => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                    selectedFile.path === file.path
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {file.category === 'database' ? (
                    <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                  <div className="truncate">
                    <p className="truncate font-mono text-[11px]">{file.filename}</p>
                    <p className="text-[9px] text-slate-500 truncate">{file.path}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Code Content Area */}
            <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-purple-300">{selectedFile.path}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedFile.description}</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950">
                <pre>{selectedFile.content}</pre>
              </div>
            </div>
          </div>
        ) : (
          /* Setup Instructions Tab */
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-300 bg-slate-950">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" /> XAMPP / Apache / MySQL Localhost Instructions
              </h3>

              <ol className="list-decimal list-inside space-y-3 leading-relaxed">
                <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white">Download Project Archive:</strong> Click the <span className="text-purple-400 font-bold">"Download Complete ZIP"</span> button above to save <code className="text-amber-300">online_voting_system_php_mysql.zip</code>.
                </li>
                <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white">Extract to XAMPP htdocs:</strong> Extract the folder into <code className="text-amber-300">C:\xampp\htdocs\online-voting-system</code>.
                </li>
                <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white">Import MySQL Database:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-400">
                    <li>Start Apache & MySQL in XAMPP Control Panel.</li>
                    <li>Open <code className="text-blue-400">http://localhost/phpmyadmin</code> in browser.</li>
                    <li>Create database named <code className="text-amber-300">online_voting_system</code>.</li>
                    <li>Import <code className="text-emerald-400">database/online_voting_system.sql</code>.</li>
                  </ul>
                </li>
                <li className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white">Access Application:</strong> Visit <code className="text-blue-400">http://localhost/online-voting-system</code>
                </li>
              </ol>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Default Test Credentials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="font-bold text-amber-300 mb-1">Admin Panel Login</p>
                  <p>URL: <code className="text-slate-400">/admin/login.php</code></p>
                  <p>Username: <code className="text-slate-200">admin</code></p>
                  <p>Password: <code className="text-slate-200">password123</code></p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <p className="font-bold text-emerald-300 mb-1">Sample Voter Account</p>
                  <p>URL: <code className="text-slate-400">/login.php</code></p>
                  <p>Username: <code className="text-slate-200">voter1</code></p>
                  <p>Password: <code className="text-slate-200">password123</code></p>
                </div>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
