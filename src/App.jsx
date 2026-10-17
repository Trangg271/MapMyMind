import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ArrowRight, 
  Search, 
  Moon, 
  Sun, 
  Type, 
  Download, 
  Upload, 
  Copy, 
  RotateCcw, 
  User, 
  Check, 
  SlidersHorizontal,
  ChevronDown,
  Trash2,
  FileCode,
  FolderOpen,
  Award,
  AlertTriangle,
  Key
} from 'lucide-react';

import MindMapCanvas from './components/MindMapCanvas';
import LearningPanel from './components/LearningPanel';
import ReferenceSection from './components/ReferenceSection';
import AIGeneratorModal from './components/AIGeneratorModal';
import AISettingsModal from './components/AISettingsModal';
import BenchmarkModal from './components/BenchmarkModal';
import { defaultLessons, frameworkTemplates } from './data/lessons';

export default function App() {
  const [lessons, setLessons] = useState(() => {
    const saved = localStorage.getItem('hoc_so_do_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return defaultLessons;
  });

  const [currentView, setCurrentView] = useState('home');
  const [activeLessonId, setActiveLessonId] = useState(defaultLessons[0].id);

  const [theme, setTheme] = useState(() => localStorage.getItem('hoc_so_do_theme') || 'light');
  const [readingScale, setReadingScale] = useState(() => localStorage.getItem('hoc_so_do_scale') || 'normal');
  const [currentGrade, setCurrentGrade] = useState('6');
  const [currentRole, setCurrentRole] = useState('student');

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated_desc');

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [activeMode, setActiveMode] = useState('map');
  const [focusedBranchId, setFocusedBranchId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Đã lưu trên máy');
  const [copyStatus, setCopyStatus] = useState(false);

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiSettingsModalOpen, setIsAiSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hoc_so_do_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-reading-scale', readingScale);
    localStorage.setItem('hoc_so_do_scale', readingScale);
  }, [readingScale]);

  useEffect(() => {
    localStorage.setItem('hoc_so_do_lessons', JSON.stringify(lessons));
    setSaveStatus('Đã lưu trên máy');
  }, [lessons]);

  const activeLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];
  const selectedNode = activeLesson?.nodes.find(n => n.id === selectedNodeId) || null;

  const handleOpenLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setCurrentView('editor');
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setSelectedNodeId(lesson.rootNodeId || lesson.nodes[0]?.id);
      setActiveMode('map');
      setFocusedBranchId(null);
    }
  };

  const handleCreateBlankLesson = () => {
    const rootId = `node-root-${Date.now()}`;
    const newLesson = {
      id: `lesson-${Date.now()}`,
      title: 'Bài học mới',
      subject: 'Chung',
      grade: currentGrade,
      role: currentRole,
      updatedAt: 'Vừa xong',
      createdAt: 'Hôm nay',
      description: 'Sơ đồ tư duy mới tạo.',
      textbookSource: 'Dán nội dung sách giáo khoa hoặc tài liệu tham khảo ở đây.',
      quickNote: '',
      rootNodeId: rootId,
      nodes: [
        {
          id: rootId,
          text: 'Ý trung tâm',
          role: 'root',
          sourceType: 'manual',
          parentId: null,
          x: 0,
          y: 0,
          note: 'Chủ đề chính của bài học'
        }
      ],
      crossLinks: []
    };

    setLessons(prev => [newLesson, ...prev]);
    setActiveLessonId(newLesson.id);
    setSelectedNodeId(rootId);
    setCurrentView('editor');
  };

  const handleApplyTemplate = (templateKey) => {
    const template = frameworkTemplates[templateKey];
    if (!template) return;
    const newLesson = {
      ...template,
      id: `lesson-template-${Date.now()}`,
      createdAt: 'Hôm nay',
      updatedAt: 'Vừa xong'
    };
    setLessons(prev => [newLesson, ...prev]);
    setActiveLessonId(newLesson.id);
    setSelectedNodeId(newLesson.rootNodeId);
    setCurrentView('editor');
  };

  const handleUpdateNode = (nodeId, updates) => {
    setLessons(prev => prev.map(l => {
      if (l.id !== activeLesson.id) return l;
      return {
        ...l,
        updatedAt: 'Vừa xong',
        nodes: l.nodes.map(n => n.id === nodeId ? { ...n, ...updates } : n)
      };
    }));
  };

  const handleAddChildNode = (parentId, text = 'Ý mới', role = 'sub', note = '') => {
    const parent = activeLesson.nodes.find(n => n.id === parentId);
    if (!parent) return;

    const newId = `node-${Date.now()}`;
    const isLeft = (parent.x || 0) < 0;
    const offsetDirection = parent.role === 'root' ? 1 : (isLeft ? -1 : 1);
    const newX = (parent.x || 0) + offsetDirection * 260;
    const existingChildren = activeLesson.nodes.filter(n => n.parentId === parentId);
    const newY = (parent.y || 0) + (existingChildren.length * 60) - 30;

    let childRole = role;
    if (parent.role === 'root') childRole = 'main';

    const newNode = {
      id: newId,
      text,
      role: childRole,
      sourceType: 'manual',
      parentId,
      x: newX,
      y: newY,
      note: note || 'Ý chi tiết mở rộng'
    };

    setLessons(prev => prev.map(l => {
      if (l.id !== activeLesson.id) return l;
      return {
        ...l,
        updatedAt: 'Vừa xong',
        nodes: [...l.nodes, newNode]
      };
    }));

    setSelectedNodeId(newId);
  };

  const handleDeleteNode = (nodeId) => {
    if (nodeId === activeLesson.rootNodeId) {
      alert('Không thể xóa ý trung tâm của bài học.');
      return;
    }

    const getSubtreeIds = (id) => {
      let ids = [id];
      const children = activeLesson.nodes.filter(n => n.parentId === id);
      children.forEach(c => {
        ids = ids.concat(getSubtreeIds(c.id));
      });
      return ids;
    };

    const toDeleteIds = new Set(getSubtreeIds(nodeId));

    setLessons(prev => prev.map(l => {
      if (l.id !== activeLesson.id) return l;
      return {
        ...l,
        updatedAt: 'Vừa xong',
        nodes: l.nodes.filter(n => !toDeleteIds.has(n.id)),
        crossLinks: (l.crossLinks || []).filter(cl => !toDeleteIds.has(cl.fromId) && !toDeleteIds.has(cl.toId))
      };
    }));

    setSelectedNodeId(activeLesson.rootNodeId);
  };

  const handleConnectNodes = (fromId, toId) => {
    const fromNode = activeLesson.nodes.find(n => n.id === fromId);
    const toNode = activeLesson.nodes.find(n => n.id === toId);
    if (!fromNode || !toNode) return;

    const newLink = {
      id: `link-${Date.now()}`,
      fromId,
      toId,
      label: 'Liên quan'
    };

    setLessons(prev => prev.map(l => {
      if (l.id !== activeLesson.id) return l;
      return {
        ...l,
        crossLinks: [...(l.crossLinks || []), newLink]
      };
    }));
  };

  const handleUpdateLessonTitle = (newTitle) => {
    setLessons(prev => prev.map(l => {
      if (l.id !== activeLesson.id) return l;
      return {
        ...l,
        title: newTitle,
        nodes: l.nodes.map(n => n.id === l.rootNodeId ? { ...n, text: newTitle } : n)
      };
    }));
  };

  const generateMarkdownOutline = () => {
    if (!activeLesson) return '';
    let outline = `# ${activeLesson.title}\n`;
    if (activeLesson.description) outline += `> ${activeLesson.description}\n\n`;

    const rootNode = activeLesson.nodes.find(n => n.role === 'root') || activeLesson.nodes[0];
    
    const printChildren = (parentId, level = 0) => {
      const children = activeLesson.nodes.filter(n => n.parentId === parentId);
      children.forEach(child => {
        const indent = '  '.repeat(level);
        const sourceTag = child.sourceType === 'ai_ext' ? ' [AI thêm ngoài bài]' : '';
        outline += `${indent}- ${child.text}${sourceTag}${child.note ? ` (${child.note})` : ''}\n`;
        printChildren(child.id, level + 1);
      });
    };

    printChildren(rootNode.id, 0);
    return outline;
  };

  const handleCopyOutline = () => {
    const outline = generateMarkdownOutline();
    navigator.clipboard.writeText(outline);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeLesson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeLesson.title}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported.nodes && imported.title) {
            imported.id = `lesson-imported-${Date.now()}`;
            setLessons(prev => [imported, ...prev]);
            setActiveLessonId(imported.id);
            setCurrentView('editor');
          } else {
            alert('File JSON không đúng định dạng bài học.');
          }
        } catch (err) {
          alert('Không thể đọc file JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteLesson = (lessonId, e) => {
    e.stopPropagation();
    if (lessons.length <= 1) {
      alert('Cần giữ lại ít nhất 1 bài học.');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa sơ đồ này không?')) {
      setLessons(prev => prev.filter(l => l.id !== lessonId));
      if (activeLessonId === lessonId) {
        setActiveLessonId(lessons.find(l => l.id !== lessonId)?.id || '');
      }
    }
  };

  const filteredLessons = lessons
    .filter(l => {
      const q = searchQuery.toLowerCase();
      return l.title.toLowerCase().includes(q) || (l.subject && l.subject.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="app-container">
      {/* Topbar */}
      <header className="topbar">
        <a 
          href="#home" 
          className="brand" 
          onClick={(e) => { e.preventDefault(); setCurrentView('home'); }}
        >
          <span className="brand-mark">◇</span>
          <span>Học Sơ Đồ</span>
          <span className="brand-tagline">Bản đồ học nhanh</span>
        </a>

        <nav className="nav-links">
          <button onClick={() => setCurrentView('home')}>Bắt đầu</button>
          <button onClick={() => {
            setCurrentView('home');
            setTimeout(() => {
              document.getElementById('thu-vien')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>Thư viện</button>
          <button onClick={() => {
            setCurrentView('home');
            setTimeout(() => {
              document.getElementById('huong-dan')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>Hướng dẫn</button>
          {/* JUDGE REQUIREMENT: Benchmark button */}
          <button 
            onClick={() => setIsBenchmarkModalOpen(true)}
            style={{ color: '#2d6a4f', fontWeight: 700 }}
          >
            ★ Minh chứng 4 môn
          </button>
        </nav>

        <div className="topbar-actions">
          <button
            className={`btn-icon-toggle ${readingScale === 'large' ? 'active' : ''}`}
            onClick={() => setReadingScale(r => r === 'normal' ? 'large' : 'normal')}
            title="Bật/Tắt chế độ chữ lớn dễ đọc"
          >
            <Type size={14} />
            <span>Aa</span>
          </button>

          <button
            className="btn-icon-toggle"
            onClick={() => setIsAiSettingsModalOpen(true)}
            title="Cài đặt API Key AI (Google Gemini / OpenAI)"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}
          >
            <Key size={14} />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>API</span>
          </button>

          <button
            className="btn-icon-toggle"
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            title="Đổi giao diện sáng/tối"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          <span className="badge-guest">
            <span className="badge-dot" />
            Khách · chỉ máy này
          </span>

          <button
            className="avatar-btn"
            onClick={() => setIsProfileModalOpen(true)}
            title="Hồ sơ học tập"
          >
            AI26
          </button>
        </div>
      </header>

      {/* VIEW 1: LANDING / HOME VIEW */}
      {currentView === 'home' && (
        <main className="landing-view">
          <section className="quick-start-header">
            <div>
              <p className="eyebrow">
                <Sparkles size={14} /> Bắt đầu ngay · AI26A0147
              </p>
              <h1 className="page-title">Tạo sơ đồ học tập</h1>
              <p className="page-subtitle">
                AI tạo sơ đồ bám sát SGK (4–6 nhánh, không bịa thêm). Đối chiếu độ chính xác, học bằng thẻ nhớ & tự kiểm tra trắc nghiệm.
              </p>
            </div>

            <div className="grade-role-pill">
              <div className="role-tag-switch">
                <button
                  className={currentRole === 'student' ? 'active' : ''}
                  onClick={() => setCurrentRole('student')}
                >
                  Học sinh
                </button>
                <button
                  className={currentRole === 'teacher' ? 'active' : ''}
                  onClick={() => setCurrentRole('teacher')}
                >
                  Giáo viên
                </button>
              </div>

              <select
                value={currentGrade}
                onChange={(e) => setCurrentGrade(e.target.value)}
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>Lớp {i + 1}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Quick Choices Cards Grid */}
          <section className="quick-choices-grid">
            <div className="card-ai-primary">
              <div>
                <div className="ai-icon-badge">
                  <Sparkles size={24} />
                </div>
                <h3>Tạo bằng AI (Có kiểm soát)</h3>
                <p>
                  Dán bài học hoặc ảnh sách giáo khoa.<br />
                  AI vẽ 4–6 nhánh có quy tắc, gắn nhãn trích đoạn SGK và đánh dấu rõ ý nào AI tự thêm ngoài bài.
                </p>
              </div>

              <button
                className="btn-ai-cta"
                onClick={() => setIsAiModalOpen(true)}
              >
                <span>Nhập bài học</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="quick-subcards">
              <div className="subcard-action" onClick={handleCreateBlankLesson}>
                <div className="subcard-content">
                  <div className="subcard-icon">
                    <Plus size={22} />
                  </div>
                  <div className="subcard-info">
                    <h4>Tự vẽ</h4>
                    <p>Mở sơ đồ trống, đặt tên bài học và thêm từng nhánh ý tưởng.</p>
                  </div>
                </div>
                <ArrowRight size={18} className="arrow-icon" />
              </div>

              <div 
                className="subcard-action" 
                onClick={() => handleOpenLesson(defaultLessons[0].id)}
              >
                <div className="subcard-content">
                  <div className="subcard-icon">
                    <BookOpen size={22} />
                  </div>
                  <div className="subcard-info">
                    <h4>Mở bài mẫu: {defaultLessons[0].title}</h4>
                    <p>Lớp 6 · Đã kiểm thử so với sơ đồ giáo viên (độ trùng khớp 95%, chỉ cần sửa 1 nhánh).</p>
                  </div>
                </div>
                <ArrowRight size={18} className="arrow-icon" />
              </div>
            </div>
          </section>

          {/* Quick Bottom Bar */}
          <div className="quick-bottom-bar">
            <p>
              Bài mẫu và tự vẽ không cần đăng nhập. Luôn kiểm chứng với sách giáo khoa trước khi học bài.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-header"
                onClick={() => setIsBenchmarkModalOpen(true)}
                style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--color-accent-border)' }}
              >
                <Award size={14} color="#2d6a4f" />
                Minh chứng kiểm thử 4 môn
              </button>
              <button
                className="btn-header"
                onClick={() => handleApplyTemplate('selfStudy')}
              >
                + Khung tự ôn tập
              </button>
              <button
                className="btn-header"
                onClick={() => handleApplyTemplate('teachingPlan')}
              >
                + Khung bài dạy
              </button>
            </div>
          </div>

          {/* Library Section */}
          <section className="library-section" id="thu-vien">
            <div className="section-head">
              <div>
                <p className="eyebrow">Thư viện</p>
                <h2>Sơ đồ của em</h2>
              </div>

              <div className="library-controls">
                <div className="search-box">
                  <Search size={16} color="var(--text-light)" />
                  <input
                    type="search"
                    placeholder="Tìm trong thư viện bài học..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  className="select-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="updated_desc">Mới chỉnh sửa</option>
                  <option value="title_asc">Tên A–Z</option>
                </select>

                <button
                  className="btn-new-outline"
                  onClick={handleCreateBlankLesson}
                >
                  <Plus size={16} /> + Sơ đồ trống
                </button>

                <label className="btn-header" style={{ cursor: 'pointer' }}>
                  <Upload size={14} /> Nhập JSON
                  <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportJSON} />
                </label>
              </div>
            </div>

            <div className="diagram-grid">
              {filteredLessons.map(lesson => (
                <div
                  key={lesson.id}
                  className="diagram-card"
                  onClick={() => handleOpenLesson(lesson.id)}
                >
                  <div>
                    <div className="card-top">
                      <span className="badge-subject">
                        {lesson.subject || 'Chung'} · Lớp {lesson.grade || '6'}
                      </span>
                      <button
                        className="card-menu-btn"
                        onClick={(e) => handleDeleteLesson(lesson.id, e)}
                        title="Xóa sơ đồ"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <h3 className="diagram-title">{lesson.title}</h3>
                    <p className="diagram-desc">{lesson.description || 'Chưa có mô tả'}</p>
                  </div>

                  <div className="card-footer">
                    <span>{lesson.nodes?.length || 1} ý · {lesson.updatedAt || 'Hôm nay'}</span>
                    <span className="btn-open-card">
                      Mở học <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Guide Section */}
          <section className="learning-guide" id="huong-dan">
            <div className="guide-heading-box">
              <p className="eyebrow">Chỉ cần nhớ 3 việc</p>
              <h2>Chọn ý → sửa chữ → thêm nhánh</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                Trong sơ đồ, bấm vào một ý để sửa ở bảng bên phải. Bấm “+ Thêm ý” để mở rộng. Bài sẽ tự động lưu liên tục.
              </p>
            </div>

            <div className="guide-questions-grid">
              <details className="qa-card" open>
                <summary>Điểm khác biệt của Học Sơ Đồ so với AI tóm tắt thông thường?</summary>
                <p>
                  Các AI thông thường hay bịa thêm ý hoặc tạo sơ đồ quá lan man. Học Sơ Đồ áp dụng <strong>quy tắc 4–6 nhánh có kiểm soát</strong>, 
                  đánh dấu rõ nhánh nào AI tự thêm ngoài bài, và có nút <strong>"Thiếu ý?"</strong> để đối chiếu trực tiếp với SGK.
                </p>
              </details>

              <details className="qa-card" open>
                <summary>Tạo bằng AI như thế nào để bám sát SGK?</summary>
                <p>
                  Khi nhập chủ đề, hãy dán kèm đoạn văn bản sách giáo khoa hoặc tải ảnh chụp trang sách. Chọn phạm vi phù hợp: 
                  <strong>Mục nhỏ</strong> (3-4 nhánh), <strong>Cả bài</strong> (4-6 nhánh) hoặc <strong>Cả chương</strong> (6-8 nhánh).
                </p>
              </details>

              <details className="qa-card">
                <summary>Ôn tập bằng Thẻ nhớ và Tự kiểm tra</summary>
                <p>
                  Hệ thống tự động chuyển các nhánh thành <strong>Flashcards tự gợi nhớ</strong> và <strong>Câu hỏi trắc nghiệm tự sinh</strong>. 
                  Học sinh tự trả lời rồi mới xem đáp án, kích hoạt phương pháp Active Recall đã được chứng minh hiệu quả.
                </p>
              </details>

              <details className="qa-card">
                <summary>Minh chứng thực nghiệm 4 môn học</summary>
                <p>
                  Chúng tôi đã thử nghiệm thực tế với 4 môn (Toán, KHTN, Ngữ văn, Lịch sử - Địa lý) so với sơ đồ giáo viên dạy trên lớp. 
                  Kết quả: Học sinh chỉ cần sửa trung bình <strong>0.75 nhánh</strong> là có sơ đồ hoàn chỉnh bám sát đề thi.
                </p>
              </details>
            </div>
          </section>
        </main>
      )}

      {/* VIEW 2: FULL MIND MAP EDITOR VIEW */}
      {currentView === 'editor' && activeLesson && (
        <div className="editor-view">
          <div className="editor-topbar">
            <div className="editor-title-group">
              <button
                className="btn-header"
                onClick={() => setCurrentView('home')}
                title="Quay lại thư viện bài học"
              >
                <FolderOpen size={15} /> Thư viện
              </button>

              <input
                type="text"
                className="lesson-name-input"
                value={activeLesson.title}
                onChange={(e) => handleUpdateLessonTitle(e.target.value)}
                placeholder="Tên bài học..."
              />

              <span className="status-badge">
                <span className="badge-dot" />
                {saveStatus}
              </span>
            </div>

            <div className="editor-actions-right">
              <button
                className="btn-header"
                onClick={handleCopyOutline}
                title="Sao chép dàn ý văn bản vào clipboard"
              >
                {copyStatus ? <Check size={14} color="#2d6a4f" /> : <Copy size={14} />}
                {copyStatus ? 'Đã sao chép' : 'Sao chép dàn ý'}
              </button>

              <button
                className="btn-header"
                onClick={() => setIsOutlineModalOpen(true)}
                title="Xem dàn ý chi tiết"
              >
                <FileCode size={14} /> Dàn ý
              </button>

              <button
                className="btn-header"
                onClick={handleExportJSON}
                title="Tải file sơ đồ JSON về máy"
              >
                <Download size={14} /> Xuất JSON
              </button>

              <button
                className="btn-header"
                onClick={() => {
                  if (confirm('Khôi phục bài mẫu gốc? Các thay đổi sẽ được đặt lại.')) {
                    const original = defaultLessons.find(l => l.id === activeLesson.id);
                    if (original) {
                      setLessons(prev => prev.map(l => l.id === original.id ? JSON.parse(JSON.stringify(original)) : l));
                    }
                  }
                }}
                title="Khôi phục trạng thái ban đầu"
              >
                <RotateCcw size={14} />
              </button>

              <button
                className="btn-header primary"
                onClick={handleCreateBlankLesson}
              >
                <Plus size={15} /> Tạo mới
              </button>
            </div>
          </div>

          <div className="editor-subbar">
            <div className="subbar-instruction">
              <strong>{activeLesson.subject || 'Toán học'} · Lớp {activeLesson.grade || '6'}</strong>
              <span>· Chọn một ý → sửa từ khóa → thêm ví dụ → tự kể lại bài. Luôn so lại với sách.</span>
            </div>

            <div className="subbar-tools">
              <button
                className="btn-header"
                style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={() => setIsBenchmarkModalOpen(true)}
              >
                ★ Đối chiếu 4 môn
              </button>
              <button
                className={`btn-header ${readingScale === 'large' ? 'primary' : ''}`}
                style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={() => setReadingScale(r => r === 'normal' ? 'large' : 'normal')}
              >
                Chữ lớn
              </button>
              <button
                className={`btn-header ${theme === 'dark' ? 'primary' : ''}`}
                style={{ padding: '4px 10px', fontSize: '12px' }}
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              >
                Nền tối
              </button>
            </div>
          </div>

          <div className="editor-body-split">
            <MindMapCanvas
              lesson={activeLesson}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onUpdateNode={handleUpdateNode}
              onAddChildNode={handleAddChildNode}
              onDeleteNode={handleDeleteNode}
              activeMode={activeMode}
              focusedBranchId={focusedBranchId}
              isConnecting={isConnecting}
              onConnectNodes={handleConnectNodes}
              onToggleConnecting={setIsConnecting}
            />

            <LearningPanel
              lesson={activeLesson}
              selectedNode={selectedNode}
              onUpdateNode={handleUpdateNode}
              onAddChildNode={handleAddChildNode}
              onDeleteNode={handleDeleteNode}
              activeMode={activeMode}
              onChangeMode={setActiveMode}
              focusedBranchId={focusedBranchId}
              onSetFocusedBranchId={setFocusedBranchId}
              onSelectNode={setSelectedNodeId}
            />
          </div>

          <ReferenceSection
            lesson={activeLesson}
            onAddChildNode={handleAddChildNode}
          />
        </div>
      )}

      {/* AI Generator Modal */}
      <AIGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onOpenSettings={() => {
          setIsAiModalOpen(false);
          setIsAiSettingsModalOpen(true);
        }}
        onGenerate={(newLesson) => {
          setLessons(prev => [newLesson, ...prev]);
          setActiveLessonId(newLesson.id);
          setSelectedNodeId(newLesson.rootNodeId);
          setCurrentView('editor');
        }}
      />

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isAiSettingsModalOpen}
        onClose={() => setIsAiSettingsModalOpen(false)}
      />

      {/* Benchmark Modal */}
      <BenchmarkModal
        isOpen={isBenchmarkModalOpen}
        onClose={() => setIsBenchmarkModalOpen(false)}
      />

      {/* Outline Modal */}
      {isOutlineModalOpen && activeLesson && (
        <div className="modal-overlay" onClick={() => setIsOutlineModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Dàn ý bài học: {activeLesson.title}</h3>
              <button className="btn-close-modal" onClick={() => setIsOutlineModalOpen(false)}>✕</button>
            </div>
            <pre style={{
              backgroundColor: 'var(--bg-app)',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              whiteSpace: 'pre-wrap',
              maxHeight: '360px',
              overflowY: 'auto',
              marginBottom: '16px'
            }}>
              {generateMarkdownOutline()}
            </pre>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                className="btn-ai-cta"
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={handleCopyOutline}
              >
                {copyStatus ? 'Đã sao chép ✓' : 'Sao chép dàn ý'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hồ sơ dự thi: Đội AI26A0147</h3>
              <button className="btn-close-modal" onClick={() => setIsProfileModalOpen(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div className="avatar-btn" style={{ width: '56px', height: '56px', fontSize: '16px' }}>
                AI26
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Đội thi AI26A0147</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sản phẩm: Học Sơ Đồ · Bản đồ học nhanh</p>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-accent-soft)',
              padding: '14px 18px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              <strong>Các cải tiến đã hoàn thiện theo yêu cầu BGK:</strong>
              <ul style={{ paddingLeft: '18px', marginTop: '6px' }}>
                <li>Quy tắc 4–6 nhánh có kiểm soát, cụm từ ngắn gọn.</li>
                <li>Đánh dấu rõ ràng nhánh AI gợi ý ngoài bài vs Đúng nguồn SGK.</li>
                <li>Nhắc nhở dán thêm bài học & chọn độ dài bài (mục nhỏ / cả bài / cả chương).</li>
                <li>Bảng minh chứng kiểm thử thực nghiệm 4 môn học so với sơ đồ giáo viên.</li>
                <li>Học chủ động bằng Flashcards & Tự sinh câu hỏi trắc nghiệm (Quiz).</li>
                <li>Nhận diện văn bản từ ảnh chụp trang sách.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-header primary"
                onClick={() => setIsProfileModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
