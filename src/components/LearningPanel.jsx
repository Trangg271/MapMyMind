import React, { useState, useEffect } from 'react';
import { 
  Map, 
  GitBranch, 
  Layers, 
  HelpCircle, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Eye, 
  RotateCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LearningPanel({
  lesson,
  selectedNode,
  onUpdateNode,
  onAddChildNode,
  onDeleteNode,
  activeMode,
  onChangeMode,
  focusedBranchId,
  onSetFocusedBranchId,
  onSelectNode
}) {
  // Quick note scratchpad state
  const [quickNote, setQuickNote] = useState(lesson.quickNote || '');
  const [noteSaved, setNoteSaved] = useState(false);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [masteredCards, setMasteredCards] = useState({});

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizKey, setQuizKey] = useState(0);

  useEffect(() => {
    setQuickNote(lesson.quickNote || '');
  }, [lesson.id, lesson.quickNote]);

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Main branch nodes for branch walkthrough and flashcards
  const mainBranches = lesson.nodes.filter(n => n.role === 'main');
  const allParentNodes = lesson.nodes.filter(n => {
    return lesson.nodes.some(child => child.parentId === n.id);
  });
  const flashcardNodes = allParentNodes.length > 0 ? allParentNodes : lesson.nodes;

  const currentFlashcardNode = flashcardNodes[flashcardIndex] || flashcardNodes[0];
  const flashcardChildren = currentFlashcardNode ? 
    lesson.nodes.filter(n => n.parentId === currentFlashcardNode.id) : [];

  // Quiz generator from mind map nodes
  const generateQuizQuestions = () => {
    const questions = [];
    const mainNodes = lesson.nodes.filter(n => n.role === 'main');
    const rootNode = lesson.nodes.find(n => n.role === 'root') || lesson.nodes[0];

    mainNodes.forEach((mn, idx) => {
      const children = lesson.nodes.filter(n => n.parentId === mn.id);
      if (children.length > 0) {
        // Question 1: Which child belongs to this branch?
        const correctText = children[0].text;
        const otherBranchesChildren = lesson.nodes
          .filter(n => n.parentId && n.parentId !== mn.id && n.id !== mn.id)
          .map(n => n.text);

        const distractor1 = otherBranchesChildren[0] || 'Khái niệm mở rộng ngoài SGK';
        const distractor2 = otherBranchesChildren[1] || 'Định lý chưa được chứng minh';
        const distractor3 = otherBranchesChildren[2] || 'Công thức chỉ áp dụng cho số âm';

        const options = [
          { text: correctText, isCorrect: true },
          { text: distractor1, isCorrect: false },
          { text: distractor2, isCorrect: false },
          { text: distractor3, isCorrect: false }
        ].sort(() => 0.5 - Math.random());

        questions.push({
          id: `q-${mn.id}-${idx}`,
          nodeId: mn.id,
          prompt: `Trong chủ đề "${rootNode?.text || ''}", ý nào sau đây thuộc nhánh "${mn.text}"?`,
          hint: mn.note || 'Xem lại nhánh trong sơ đồ.',
          options
        });
      }
    });

    if (questions.length === 0) {
      // Fallback question
      questions.push({
        id: 'q-default',
        nodeId: rootNode?.id,
        prompt: `Mục tiêu cốt lõi của bài học "${rootNode?.text || ''}" là gì?`,
        hint: 'Nắm vững kiến thức trọng tâm.',
        options: [
          { text: 'Hiểu bản chất và vận dụng giải bài tập', isCorrect: true },
          { text: 'Chỉ học thuộc lòng không cần hiểu bản chất', isCorrect: false },
          { text: 'Bỏ qua các bước rút gọn và kiểm tra', isCorrect: false }
        ]
      });
    }

    return questions;
  };

  const [quizQuestions, setQuizQuestions] = useState(generateQuizQuestions());

  const handleResetQuiz = () => {
    setQuizQuestions(generateQuizQuestions());
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizKey(k => k + 1);
  };

  const currentQuizQ = quizQuestions[quizIndex] || quizQuestions[0];

  const handleSelectQuizOption = (opt) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(opt);
    if (opt.isCorrect) {
      setQuizScore(s => s + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleMarkMastered = (cardId) => {
    setMasteredCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  return (
    <aside className="editor-sidebar">
      {/* Selected Node Inspector Section */}
      {selectedNode && (
        <div className="sidebar-section">
          <div className="sidebar-title">Nút đang chọn</div>
          <div className="node-inspector-title">{selectedNode.text}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            {selectedNode.role === 'root'
              ? 'Đây là ý trung tâm. Hãy giữ thật ngắn để nhìn được toàn cảnh.'
              : 'Chọn một ý → sửa từ khóa → thêm ví dụ → tự kể lại bài.'}
          </p>

          <div className="field-group">
            <label className="field-label">Nội dung ý</label>
            <input
              type="text"
              className="field-input"
              value={selectedNode.text}
              onChange={(e) => onUpdateNode(selectedNode.id, { text: e.target.value })}
            />
          </div>

          <div className="field-group">
            <label className="field-label">Vai trò trong sơ đồ</label>
            <select
              className="field-select"
              value={selectedNode.role}
              onChange={(e) => onUpdateNode(selectedNode.id, { role: e.target.value })}
            >
              <option value="root">Ý trung tâm</option>
              <option value="main">Ý chính</option>
              <option value="sub">Ý phụ / Chi tiết</option>
              <option value="example">Ví dụ thực tế</option>
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Ghi chú đối chiếu / Trích đoạn</label>
            <textarea
              className="field-textarea"
              rows={2}
              value={selectedNode.note || ''}
              placeholder="Nhập ghi chú hoặc nguồn trích dẫn SGK..."
              onChange={(e) => onUpdateNode(selectedNode.id, { note: e.target.value })}
            />
          </div>

          <div className="node-actions-row">
            <button
              className="btn-sidebar-action primary"
              onClick={() => onAddChildNode(selectedNode.id)}
            >
              <Plus size={15} /> + Thêm ý con
            </button>
            {selectedNode.role !== 'root' && (
              <button
                className="btn-sidebar-action danger"
                onClick={() => onDeleteNode(selectedNode.id)}
              >
                <Trash2 size={15} /> Xóa ý này
              </button>
            )}
          </div>
        </div>
      )}

      {/* Learning Modes Section */}
      <div className="sidebar-section">
        <div className="sidebar-title">Chế độ học tập</div>

        {/* 4 Tabs */}
        <div className="learning-mode-tabs">
          <button
            className={`tab-btn ${activeMode === 'map' ? 'active' : ''}`}
            onClick={() => onChangeMode('map')}
          >
            <Map size={16} />
            <span>Bản đồ</span>
          </button>
          <button
            className={`tab-btn ${activeMode === 'branch' ? 'active' : ''}`}
            onClick={() => {
              onChangeMode('branch');
              if (mainBranches.length > 0 && !focusedBranchId) {
                onSetFocusedBranchId(mainBranches[0].id);
              }
            }}
          >
            <GitBranch size={16} />
            <span>Từng nhánh</span>
          </button>
          <button
            className={`tab-btn ${activeMode === 'flashcards' ? 'active' : ''}`}
            onClick={() => {
              onChangeMode('flashcards');
              setIsAnswerRevealed(false);
            }}
          >
            <Layers size={16} />
            <span>Thẻ nhớ</span>
          </button>
          <button
            className={`tab-btn ${activeMode === 'quiz' ? 'active' : ''}`}
            onClick={() => onChangeMode('quiz')}
          >
            <HelpCircle size={16} />
            <span>Tự kiểm tra</span>
          </button>
        </div>

        {/* Mode 1: Map Overview Stats */}
        {activeMode === 'map' && (
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <p><strong>Toàn cảnh bài học:</strong> {lesson.nodes.length} ý ({mainBranches.length} nhánh chính).</p>
            <p style={{ marginTop: '8px' }}>
              Mẹo: Nhấp đúp vào nút để sửa nhanh. Giữ chuột để kéo di chuyển và sắp xếp lại theo ý bạn.
            </p>
          </div>
        )}

        {/* Mode 2: By Branch Walkthrough */}
        {activeMode === 'branch' && (
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Đang tập trung vào 1 nhánh để ôn luyện chuyên sâu.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {mainBranches.map((branch, i) => (
                <button
                  key={branch.id}
                  onClick={() => {
                    onSetFocusedBranchId(branch.id);
                    onSelectNode(branch.id);
                  }}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    borderRadius: '8px',
                    backgroundColor: focusedBranchId === branch.id ? 'var(--color-primary)' : 'var(--bg-app)',
                    color: focusedBranchId === branch.id ? '#fff' : 'var(--text-main)',
                    fontWeight: 600,
                    fontSize: '13px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{i + 1}. {branch.text}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mode 3: Flashcards / Thẻ nhớ */}
        {activeMode === 'flashcards' && currentFlashcardNode && (
          <div>
            <div className="flashcard-box">
              <div className="flashcard-header">
                THẺ NHỚ · {flashcardIndex + 1}/{flashcardNodes.length}
              </div>
              <div className="flashcard-prompt">
                Hãy tự nói lại: {currentFlashcardNode.text}
              </div>
              <div className="flashcard-hint">
                Thử gọi lại {flashcardChildren.length} ý con trước khi hiện đáp án.
              </div>

              {!isAnswerRevealed ? (
                <button
                  className="btn-reveal"
                  onClick={() => setIsAnswerRevealed(true)}
                >
                  <Eye size={15} style={{ display: 'inline', marginRight: '6px' }} />
                  Hiện đáp án
                </button>
              ) : (
                <div className="flashcard-answers">
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Đáp án ({flashcardChildren.length} ý con):
                  </p>
                  {flashcardChildren.length > 0 ? (
                    flashcardChildren.map(c => (
                      <div key={c.id} className="answer-item">
                        <CheckCircle2 size={14} color="var(--color-accent-bright)" />
                        <span>{c.text}</span>
                      </div>
                    ))
                  ) : (
                    <div className="answer-item">
                      <span>{currentFlashcardNode.note || 'Ý này là khái niệm độc lập.'}</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleMarkMastered(currentFlashcardNode.id)}
                    style={{
                      marginTop: '10px',
                      padding: '8px',
                      width: '100%',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: masteredCards[currentFlashcardNode.id] ? '#d8f3dc' : 'var(--bg-app)',
                      color: masteredCards[currentFlashcardNode.id] ? '#1b4332' : 'var(--text-main)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 size={14} />
                    {masteredCards[currentFlashcardNode.id] ? 'Đã nhớ vững ✓' : 'Đánh dấu đã nhớ'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-sidebar-action"
                style={{ border: '1px solid var(--border-subtle)' }}
                disabled={flashcardIndex === 0}
                onClick={() => {
                  setFlashcardIndex(i => Math.max(i - 1, 0));
                  setIsAnswerRevealed(false);
                }}
              >
                <ChevronLeft size={16} /> Trước
              </button>
              <button
                className="btn-sidebar-action primary"
                disabled={flashcardIndex === flashcardNodes.length - 1}
                onClick={() => {
                  setFlashcardIndex(i => Math.min(i + 1, flashcardNodes.length - 1));
                  setIsAnswerRevealed(false);
                }}
              >
                Sau <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Mode 4: Quiz / Tự kiểm tra */}
        {activeMode === 'quiz' && currentQuizQ && (
          <div key={`quiz-${quizKey}`}>
            <div className="quiz-box">
              <div className="quiz-step-count">
                Câu {quizIndex + 1}/{quizQuestions.length} · Tự trả lời trước khi xem đáp án.
              </div>
              <div className="quiz-question-text">
                {currentQuizQ.prompt}
              </div>

              <div className="quiz-options-list">
                {currentQuizQ.options.map((opt, i) => {
                  let optClass = 'quiz-opt-btn';
                  if (selectedAnswer !== null) {
                    if (opt.isCorrect) optClass += ' correct';
                    else if (selectedAnswer === opt) optClass += ' incorrect';
                  }

                  return (
                    <button
                      key={i}
                      className={optClass}
                      onClick={() => handleSelectQuizOption(opt)}
                    >
                      {String.fromCharCode(65 + i)}. {opt.text}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {selectedAnswer.isCorrect ? (
                    <span style={{ color: '#2d6a4f', fontWeight: 600 }}>✓ Chính xác! Bạn đã ghi nhớ rất tốt.</span>
                  ) : (
                    <span style={{ color: '#b91c1c' }}>✗ Chưa chính xác. Gợi ý: {currentQuizQ.hint}</span>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                className="btn-sidebar-action"
                style={{ border: '1px solid var(--border-subtle)' }}
                disabled={quizIndex === 0}
                onClick={() => {
                  setQuizIndex(i => Math.max(i - 1, 0));
                  setSelectedAnswer(null);
                }}
              >
                ← Trước
              </button>
              <button
                className="btn-sidebar-action primary"
                disabled={quizIndex === quizQuestions.length - 1}
                onClick={() => {
                  setQuizIndex(i => Math.min(i + 1, quizQuestions.length - 1));
                  setSelectedAnswer(null);
                }}
              >
                Sau →
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn-sidebar-action"
                style={{ border: '1px solid var(--border-subtle)' }}
                onClick={handleResetQuiz}
              >
                <RotateCw size={13} /> Tạo lại câu hỏi
              </button>
              {currentQuizQ.nodeId && (
                <button
                  className="btn-sidebar-action"
                  style={{ border: '1px solid var(--border-subtle)' }}
                  onClick={() => onSelectNode(currentQuizQ.nodeId)}
                >
                  Xem ý liên quan
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Notes Scratchpad Section */}
      <div className="sidebar-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="sidebar-title" style={{ margin: 0 }}>Ghi nhớ nhanh</div>
          <span style={{ fontSize: '11px', color: noteSaved ? '#2d6a4f' : 'var(--text-light)', fontWeight: 600 }}>
            {noteSaved ? '✓ Đã ghi nhớ' : '• Lưu trên máy'}
          </span>
        </div>
        <div className="quick-notes-box">
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Viết ghi chú ngắn cho bài học này..."
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Lưu riêng trên thiết bị này.</span>
            <button
              onClick={handleSaveNote}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              Ghi nhớ
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
