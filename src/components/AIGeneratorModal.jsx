import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  X
} from 'lucide-react';
import { 
  getAIConfig, 
  generateMindMapFromAI, 
  AI_PROVIDERS 
} from '../services/aiService';

export default function AIGeneratorModal({
  isOpen,
  onClose,
  onGenerate,
  onOpenSettings
}) {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('Toán học');
  const [grade, setGrade] = useState('6');
  const [scope, setScope] = useState('standard'); // 'small' | 'standard' | 'chapter'
  const [lessonText, setLessonText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [aiConfig, setAiConfig] = useState(getAIConfig());

  useEffect(() => {
    if (isOpen) {
      setAiConfig(getAIConfig());
      setErrorMessage('');
      setGenerationStep('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickSamples = [
    {
      topic: 'Định luật bảo toàn khối lượng',
      subject: 'Khoa học tự nhiên',
      grade: '8',
      scope: 'standard',
      text: 'Trong một phản ứng hóa học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng của các chất tham gia phản ứng. Biểu thức: mA + mB = mC + mD. Bản chất: trong phản ứng chỉ có liên kết giữa các nguyên tử thay đổi, số lượng nguyên tử mỗi nguyên tố giữ nguyên.'
    },
    {
      topic: 'Hệ thần kinh ở người',
      subject: 'Khoa học tự nhiên',
      grade: '8',
      scope: 'standard',
      text: 'Hệ thần kinh gồm bộ phận trung ương (não bộ và tủy sống) và bộ phận ngoại biên (các dây thần kinh và hạch thần kinh). Chức năng điều hòa, phối hợp hoạt động của các cơ quan trong cơ thể thích nghi với môi trường sống.'
    },
    {
      topic: 'Phong trào Thơ Mới (1932 - 1945)',
      subject: 'Ngữ văn',
      grade: '11',
      scope: 'chapter',
      text: 'Phong trào Thơ Mới mang lại sự giải phóng cho cái tôi cá nhân, phá vỡ thi pháp gò bó của thơ ca trung đại. Đại diện tiêu biểu: Xuân Diệu (nhà thơ của tình yêu và tuổi trẻ), Huy Cận (nỗi buồn sầu vũ trụ), Hàn Mặc Tử (thế giới thơ kỳ bí đau thương).'
    }
  ];

  const handleApplySample = (sample) => {
    setTopic(sample.topic);
    setSubject(sample.subject);
    setGrade(sample.grade);
    setScope(sample.scope);
    setLessonText(sample.text);
    setErrorMessage('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        if (!topic) setTopic('Bài học từ ảnh chụp SGK');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName('');
  };

  // Fallback rule-based generator when no API key is available
  const generateFallbackLesson = () => {
    const rootId = `node-ai-${Date.now()}`;
    const nodes = [
      {
        id: rootId,
        text: topic.trim(),
        role: 'root',
        sourceType: 'sgk',
        sourceQuote: `Chủ đề chính: ${topic}`,
        parentId: null,
        x: 0,
        y: 0,
        note: `Chủ đề bài học: ${topic} (${subject} - Lớp ${grade})`
      }
    ];

    let targetBranchCount = 4;
    if (scope === 'small') targetBranchCount = 3;
    if (scope === 'chapter') targetBranchCount = 6;

    const sentences = lessonText
      .split(/[.\n;]+/)
      .map(s => s.trim())
      .filter(s => s.length > 5);

    if (sentences.length >= 2) {
      const count = Math.min(sentences.length, targetBranchCount);
      for (let i = 0; i < count; i++) {
        const mainBranchId = `node-m-${Date.now()}-${i}`;
        const isLeft = i % 2 === 0;
        const yPos = (Math.floor(i / 2) - Math.floor(count / 4)) * 130;

        const words = sentences[i].split(' ');
        const branchTitle = words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');

        nodes.push({
          id: mainBranchId,
          text: branchTitle,
          role: 'main',
          sourceType: 'sgk',
          sourceQuote: sentences[i],
          parentId: rootId,
          x: isLeft ? -290 : 290,
          y: yPos,
          note: sentences[i]
        });

        if (words.length > 5) {
          nodes.push({
            id: `node-s-${Date.now()}-${i}`,
            text: sentences[i],
            role: 'sub',
            sourceType: 'sgk',
            sourceQuote: sentences[i],
            parentId: mainBranchId,
            x: isLeft ? -560 : 560,
            y: yPos,
            note: 'Trích đoạn cụ thể'
          });
        }
      }
    } else {
      nodes.push(
        {
          id: `node-m1-${Date.now()}`,
          text: '1. Khái niệm cốt lõi',
          role: 'main',
          sourceType: 'sgk',
          sourceQuote: lessonText || 'Khái niệm trong SGK',
          parentId: rootId,
          x: -290,
          y: -90,
          note: 'Định nghĩa chuẩn SGK'
        },
        {
          id: `node-s1-${Date.now()}`,
          text: lessonText ? lessonText.slice(0, 60) + '...' : 'Định nghĩa cơ bản và phạm vi áp dụng',
          role: 'sub',
          sourceType: 'sgk',
          parentId: `node-m1-${Date.now()}`,
          x: -560,
          y: -90,
          note: 'Ý chi tiết'
        },
        {
          id: `node-m2-${Date.now()}`,
          text: '2. Quy tắc & Phương pháp',
          role: 'main',
          sourceType: 'sgk',
          parentId: rootId,
          x: 290,
          y: -90,
          note: 'Công thức hoặc quy trình'
        },
        {
          id: `node-m3-${Date.now()}`,
          text: '3. Ví dụ vận dụng thực tế',
          role: 'main',
          sourceType: 'sgk',
          parentId: rootId,
          x: 290,
          y: 90,
          note: 'Liên hệ thực tiễn'
        }
      );
    }

    // Add 1 explicit AI expansion branch
    const aiExtId = `node-ai-ext-${Date.now()}`;
    nodes.push({
      id: aiExtId,
      text: 'Mở rộng: Ứng dụng thực tiễn trong đời sống',
      role: 'sub',
      sourceType: 'ai_ext',
      sourceQuote: 'AI gợi ý bổ sung ngoài bài',
      parentId: nodes[1].id,
      x: (nodes[1].x < 0 ? -560 : 560),
      y: nodes[1].y + 60,
      note: 'AI tự thêm ngoài bài: Hãy đối chiếu lại với sách để kiểm chứng.'
    });

    return {
      id: `lesson-${Date.now()}`,
      title: topic.trim(),
      subject,
      grade,
      scope,
      role: 'student',
      updatedAt: 'Vừa xong',
      createdAt: 'Vừa tạo (Mô phỏng mẫu)',
      description: `Sơ đồ tạo theo quy tắc 4–6 nhánh chuẩn kiến thức SGK.`,
      textbookSource: lessonText || `Nội dung tổng hợp bài học ${topic}.`,
      quickNote: 'Sơ đồ mô phỏng theo quy tắc 4–6 nhánh. Bạn có thể thêm API Key để AI đọc sâu toàn diện.',
      rootNodeId: rootId,
      nodes,
      crossLinks: []
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setErrorMessage('');

    const currentConfig = getAIConfig();

    if (currentConfig.hasKey) {
      try {
        setGenerationStep('Đang gửi yêu cầu tới mô hình ' + (currentConfig.provider === AI_PROVIDERS.GEMINI ? 'Google Gemini' : 'OpenAI') + '...');
        
        const newLesson = await generateMindMapFromAI({
          topic: topic.trim(),
          subject,
          grade,
          scope,
          lessonText: lessonText.trim(),
          imagePreview
        });

        setIsGenerating(false);
        onGenerate(newLesson);
        onClose();
      } catch (err) {
        console.error('AI Generation Error:', err);
        setErrorMessage(err.message || 'Lỗi khi gọi API AI');
        setIsGenerating(false);
      }
    } else {
      // Offline / Fallback mode
      setGenerationStep('Đang tạo sơ đồ theo thuật toán quy chuẩn SGK (Chế độ mô phỏng)...');
      setTimeout(() => {
        const fallbackLesson = generateFallbackLesson();
        setIsGenerating(false);
        onGenerate(fallbackLesson);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-leaf-light)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Tạo sơ đồ bằng AI</h3>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onOpenSettings && (
              <button
                type="button"
                className="btn-header"
                onClick={onOpenSettings}
                style={{ padding: '6px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Cài đặt API Key"
              >
                <Key size={13} />
                <span>API Key</span>
                {aiConfig.hasKey && (
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                )}
              </button>
            )}
            <button className="btn-close-modal" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* AI Model Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: aiConfig.hasKey ? 'var(--bg-accent-soft)' : '#fffbeb',
          border: `1px solid ${aiConfig.hasKey ? 'var(--color-accent-border)' : '#fde68a'}`,
          borderRadius: '8px',
          fontSize: '12px',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color={aiConfig.hasKey ? 'var(--color-primary)' : '#d97706'} />
            <span style={{ color: aiConfig.hasKey ? 'var(--text-main)' : '#92400e' }}>
              Mô hình: <strong>{aiConfig.provider === AI_PROVIDERS.GEMINI ? 'Google Gemini (1.5 Flash)' : 'OpenAI (GPT-4o-mini)'}</strong>
              {aiConfig.hasKey ? ' • Đã sẵn sàng' : ' • Chưa có API Key (dùng chế độ mô phỏng)'}
            </span>
          </div>
          
          {onOpenSettings && !aiConfig.hasKey && (
            <button
              type="button"
              onClick={onOpenSettings}
              style={{
                background: 'none',
                border: 'none',
                color: '#b45309',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '12px'
              }}
            >
              Nhập API Key
            </button>
          )}
        </div>

        {/* Error message if generation failed */}
        {errorMessage && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '13px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <strong>Lỗi tạo sơ đồ:</strong> {errorMessage}
              <div style={{ marginTop: '4px' }}>
                <span 
                  onClick={onOpenSettings}
                  style={{ color: '#b91c1c', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                >
                  Kiểm tra lại API Key trong cài đặt
                </span>
                {' hoặc chuyển sang chế độ mô phỏng.'}
              </div>
            </div>
          </div>
        )}

        {/* Quick prompt suggestions */}
        <div style={{ marginBottom: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-light)', display: 'block', marginBottom: '6px' }}>
            Gợi ý nhanh bài học mẫu:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {quickSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(sample)}
                style={{
                  padding: '4px 10px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: 'var(--color-primary)',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                + {sample.topic}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Tên bài học *</label>
            <input
              type="text"
              required
              className="field-input"
              placeholder="Ví dụ: Phân số, Định luật bảo toàn khối lượng, Từ Hán Việt..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
            <div>
              <label className="field-label">Môn học</label>
              <select
                className="field-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="Toán học">Toán học</option>
                <option value="Ngữ văn">Ngữ văn</option>
                <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Tin học">Tin học</option>
              </select>
            </div>
            <div>
              <label className="field-label">Khối lớp</label>
              <select
                className="field-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>Lớp {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Độ dài bài học</label>
              <select
                className="field-select"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
              >
                <option value="small">Mục nhỏ (3-4 nhánh)</option>
                <option value="standard">Cả bài (4-6 nhánh)</option>
                <option value="chapter">Cả chương (6-8 nhánh)</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Nội dung bài học từ SGK hoặc tài liệu</label>
            <textarea
              className="field-textarea"
              rows={4}
              placeholder="Dán nội dung sách giáo khoa, ghi chép hoặc tài liệu học tập của bạn..."
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
            />
          </div>

          {/* Photo / OCR upload with AI Vision */}
          <div className="field-group">
            <label className="field-label">Hoặc tải ảnh chụp trang sách giáo khoa (AI Vision sẽ đọc chữ trên ảnh)</label>
            {!imagePreview ? (
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                border: '1.5px dashed var(--border-subtle)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-app)',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '13px'
              }}>
                <Upload size={16} />
                <span>Tải ảnh chụp trang sách từ máy (.png, .jpg, .webp)</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              </label>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-app)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                  />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {imageFileName || 'Ảnh trang sách đã chọn'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Sẵn sàng để AI đọc & phân tích hình ảnh
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Xóa ảnh"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn-header"
              onClick={onClose}
              disabled={isGenerating}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="btn-ai-cta"
              style={{ padding: '10px 22px', fontSize: '14px' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {generationStep || 'Đang tạo sơ đồ...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {aiConfig.hasKey ? 'Tạo sơ đồ bằng AI' : 'Tạo sơ đồ (Mô phỏng)'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
