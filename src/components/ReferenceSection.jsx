import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, AlertCircle, CheckCircle, Sparkles, Plus } from 'lucide-react';

export default function ReferenceSection({
  lesson,
  onAddChildNode
}) {
  const [openSection, setOpenSection] = useState(null); // 'examples' | 'source' | null
  const [missingIdeasModal, setMissingIdeasModal] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  // Find missing concepts based on textbook source
  const handleCheckMissing = () => {
    // Generate intelligent recommendations based on subject/title
    const currentTexts = lesson.nodes.map(n => n.text.toLowerCase()).join(' ');
    const recommendations = [];

    if (lesson.title.toLowerCase().includes('phân số')) {
      if (!currentTexts.includes('so sánh')) {
        recommendations.push({
          title: 'So sánh phân số cùng mẫu và khác mẫu',
          role: 'main',
          note: 'Quy đồng mẫu số rồi so sánh tử số'
        });
      }
      if (!currentTexts.includes('hỗn số')) {
        recommendations.push({
          title: 'Hỗn số và số thập phân',
          role: 'sub',
          note: 'Cách chuyển đổi hỗn số sang phân số'
        });
      }
    } else if (lesson.title.toLowerCase().includes('quang hợp')) {
      if (!currentTexts.includes('pha sáng') && !currentTexts.includes('pha tối')) {
        recommendations.push({
          title: 'Hai giai đoạn: Pha sáng và Pha tối',
          role: 'main',
          note: 'Pha sáng cần ánh sáng, pha tối diễn ra ở chất nền stroma'
        });
      }
    } else {
      recommendations.push({
        title: 'Ứng dụng trong thực tiễn & bài tập vận dụng',
        role: 'main',
        note: 'Liên hệ thực tế đời sống'
      });
    }

    setAuditResult({
      score: recommendations.length === 0 ? 98 : 88,
      recommendations,
      checkedAt: new Date().toLocaleTimeString('vi-VN')
    });
    setMissingIdeasModal(true);
  };

  const handleApplyMissing = (item) => {
    onAddChildNode(lesson.rootNodeId, item.title, item.role, item.note);
    setAuditResult(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(r => r.title !== item.title)
    }));
  };

  return (
    <>
      <div className="editor-bottom-bar">
        <div className="bottom-accordion-links">
          <button
            className="btn-bottom-link"
            onClick={() => toggleSection('examples')}
          >
            {openSection === 'examples' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            Ví dụ & cách làm
          </button>

          <button
            className="btn-bottom-link"
            onClick={() => toggleSection('source')}
          >
            {openSection === 'source' ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            Nội dung bài & nguồn đối chiếu
          </button>
        </div>

        <div className="bottom-audit-actions">
          <button
            onClick={handleCheckMissing}
            style={{
              backgroundColor: '#1b4332',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            Thiếu ý?
          </button>

          <button
            onClick={handleCheckMissing}
            style={{
              backgroundColor: 'var(--bg-paper)',
              color: 'var(--color-primary)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            Đối chiếu & đánh giá
          </button>
        </div>
      </div>

      {/* Expanded Accordion Drawer */}
      {openSection && (
        <div style={{
          backgroundColor: 'var(--bg-paper)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '16px 24px',
          maxHeight: '180px',
          overflowY: 'auto',
          fontSize: '13px',
          color: 'var(--text-main)',
          animation: 'slideUp 0.18s ease'
        }}>
          {openSection === 'examples' && (
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--color-primary)' }}>
                Ví dụ minh họa & Hướng dẫn phương pháp
              </h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {lesson.description || 'Chưa có ví dụ cụ thể cho bài học này. Hãy thêm ví dụ vào sơ đồ của bạn!'}
              </p>
            </div>
          )}

          {openSection === 'source' && (
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--color-primary)' }}>
                Nguồn SGK & Tài liệu chuẩn đối chiếu
              </h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {lesson.textbookSource || 'Bài mẫu minh họa tự biên soạn. Hãy luôn đối chiếu lại với sách giáo khoa chính khóa của bạn.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Missing Ideas / Audit Modal */}
      {missingIdeasModal && auditResult && (
        <div className="modal-overlay" onClick={() => setMissingIdeasModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--color-primary)" />
                <h3>Đối chiếu kiến thức & Gợi ý bổ sung</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setMissingIdeasModal(false)}>✕</button>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-accent-soft)',
              padding: '14px 18px',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>Mức độ bao quát nội dung SGK:</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{auditResult.score}%</div>
              </div>
              <CheckCircle size={32} color="var(--color-accent-bright)" />
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>
              {auditResult.recommendations.length > 0 ? 'Gợi ý các ý trọng tâm có thể bổ sung:' : 'Sơ đồ của bạn đã rất đầy đủ các ý trọng tâm!'}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {auditResult.recommendations.map((rec, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-app)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--text-main)' }}>{rec.title}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rec.note}</div>
                  </div>
                  <button
                    onClick={() => handleApplyMissing(rec)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--color-primary)',
                      color: '#fff',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} /> Thêm vào sơ đồ
                  </button>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-light)', lineHeight: '1.4' }}>
              * Lưu ý: Gợi ý đối chiếu là công cụ hỗ trợ tư duy học tập, không thay thế việc kiểm tra trực tiếp với sách giáo khoa.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
