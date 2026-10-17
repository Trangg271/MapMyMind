import React, { useState, useEffect } from 'react';
import { 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Loader2, 
  ShieldCheck,
  RefreshCw,
  FileCode2
} from 'lucide-react';
import { 
  AI_PROVIDERS, 
  getAIConfig, 
  saveAIConfig, 
  testAIConnection 
} from '../services/aiService';

export default function AISettingsModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(getAIConfig());
  const [provider, setProvider] = useState(AI_PROVIDERS.GEMINI);
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getAIConfig();
      setConfig(current);
      setProvider(current.provider);
      setGeminiKey(current.geminiKey);
      setOpenaiKey(current.openaiKey);
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeKey = provider === AI_PROVIDERS.GEMINI ? geminiKey : openaiKey;
  const isEnvActive = provider === AI_PROVIDERS.GEMINI 
    ? (!localStorage.getItem('hmm_gemini_api_key') && Boolean(import.meta.env.VITE_GEMINI_API_KEY))
    : (!localStorage.getItem('hmm_openai_api_key') && Boolean(import.meta.env.VITE_OPENAI_API_KEY));

  const handleTest = async () => {
    if (!activeKey || !activeKey.trim()) {
      setTestResult({ success: false, message: 'Vui lòng nhập API Key trước khi kiểm tra!' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testAIConnection(provider, activeKey);
      setTestResult({ success: true, message: res.message });
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Kiểm tra kết nối thất bại' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveAIConfig({
      provider,
      geminiKey,
      openaiKey
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  const handleResetToEnv = () => {
    if (provider === AI_PROVIDERS.GEMINI) {
      localStorage.removeItem('hmm_gemini_api_key');
      setGeminiKey(import.meta.env.VITE_GEMINI_API_KEY || '');
    } else {
      localStorage.removeItem('hmm_openai_api_key');
      setOpenaiKey(import.meta.env.VITE_OPENAI_API_KEY || '');
    }
    setTestResult({ success: true, message: 'Đã tải lại cấu hình từ file .env' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--bg-accent-soft)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <Key size={18} />
            </div>
            <h3>Cài đặt kết nối AI</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Bạn có thể nhập API Key trực tiếp tại đây hoặc khai báo trong file <code>.env</code> ở thư mục gốc của dự án.
        </p>

        <form onSubmit={handleSave}>
          {/* Provider Selector */}
          <div className="field-group">
            <label className="field-label">Chọn nhà cung cấp AI</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div 
                onClick={() => { setProvider(AI_PROVIDERS.GEMINI); setTestResult(null); }}
                style={{
                  border: `2px solid ${provider === AI_PROVIDERS.GEMINI ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: provider === AI_PROVIDERS.GEMINI ? 'var(--bg-accent-soft)' : 'var(--bg-card)',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>Google Gemini</strong>
                  <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    Khuyên dùng
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                  Miễn phí, tốc độ cao, nhận diện ảnh trang sách rất tốt.
                </p>
              </div>

              <div 
                onClick={() => { setProvider(AI_PROVIDERS.OPENAI); setTestResult(null); }}
                style={{
                  border: `2px solid ${provider === AI_PROVIDERS.OPENAI ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                  backgroundColor: provider === AI_PROVIDERS.OPENAI ? 'var(--bg-accent-soft)' : 'var(--bg-card)',
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>OpenAI</strong>
                  <span style={{ fontSize: '11px', background: '#e0e7ff', color: '#4338ca', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    GPT-4o-mini
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                  Mô hình thông minh, yêu cầu tài khoản OpenAI có số dư.
                </p>
              </div>
            </div>
          </div>

          {/* Key Input */}
          {provider === AI_PROVIDERS.GEMINI ? (
            <div className="field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="field-label" style={{ marginBottom: 0 }}>
                  Gemini API Key
                </label>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '12px', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  Lấy Key miễn phí tại Google AI Studio <ExternalLink size={12} />
                </a>
              </div>
              <input
                type="password"
                className="field-input"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => { setGeminiKey(e.target.value); setTestResult(null); }}
              />
            </div>
          ) : (
            <div className="field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="field-label" style={{ marginBottom: 0 }}>
                  OpenAI API Key
                </label>
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '12px', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  Lấy Key tại OpenAI Platform <ExternalLink size={12} />
                </a>
              </div>
              <input
                type="password"
                className="field-input"
                placeholder="sk-proj-..."
                value={openaiKey}
                onChange={(e) => { setOpenaiKey(e.target.value); setTestResult(null); }}
              />
            </div>
          )}

          {/* Env status badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'var(--bg-app)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileCode2 size={15} color="var(--color-primary)" />
              <span>
                File cấu hình: <strong>.env</strong> (ở thư mục gốc)
                {isEnvActive && <span style={{ color: '#15803d', marginLeft: '6px', fontWeight: 600 }}>• Đang dùng key từ .env</span>}
              </span>
            </div>
            {isEnvActive && (
              <button
                type="button"
                onClick={handleResetToEnv}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px'
                }}
              >
                <RefreshCw size={11} /> Tải lại từ file
              </button>
            )}
          </div>

          {/* Test connection alert message */}
          {testResult && (
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: testResult.success ? '#ecfdf5' : '#fef2f2',
              color: testResult.success ? '#065f46' : '#991b1b',
              border: `1px solid ${testResult.success ? '#a7f3d0' : '#fecaca'}`
            }}>
              {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <button
              type="button"
              className="btn-header"
              onClick={handleTest}
              disabled={isTesting || !activeKey}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {isTesting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              Kiểm tra kết nối
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-header"
                onClick={onClose}
              >
                Đóng
              </button>
              <button
                type="submit"
                className="btn-ai-cta"
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 size={14} /> Đã lưu!
                  </>
                ) : (
                  'Lưu cài đặt'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
