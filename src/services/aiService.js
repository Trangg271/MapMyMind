/**
 * AI Service for Map My Mind (Học Sơ Đồ)
 * Supports Google Gemini and OpenAI with Vision (image OCR & analysis)
 */

export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai'
};

/**
 * Retrieve current AI configuration (LocalStorage takes precedence over .env)
 */
export function getAIConfig() {
  const envGemini = import.meta.env.VITE_GEMINI_API_KEY || '';
  const envOpenAI = import.meta.env.VITE_OPENAI_API_KEY || '';
  const envDefaultProvider = import.meta.env.VITE_DEFAULT_AI_PROVIDER || AI_PROVIDERS.GEMINI;

  const localProvider = localStorage.getItem('hmm_ai_provider');
  const localGemini = localStorage.getItem('hmm_gemini_api_key');
  const localOpenAI = localStorage.getItem('hmm_openai_api_key');

  const provider = localProvider || envDefaultProvider || AI_PROVIDERS.GEMINI;
  const geminiKey = (localGemini !== null && localGemini !== '') ? localGemini : envGemini;
  const openaiKey = (localOpenAI !== null && localOpenAI !== '') ? localOpenAI : envOpenAI;

  const activeKey = provider === AI_PROVIDERS.GEMINI ? geminiKey : openaiKey;
  const hasKey = Boolean(activeKey && activeKey.trim().length > 0);

  return {
    provider,
    geminiKey,
    openaiKey,
    activeKey,
    hasKey,
    isFromEnv: provider === AI_PROVIDERS.GEMINI ? (!localGemini && Boolean(envGemini)) : (!localOpenAI && Boolean(envOpenAI))
  };
}

/**
 * Save AI configuration to LocalStorage
 */
export function saveAIConfig({ provider, geminiKey, openaiKey }) {
  if (provider) localStorage.setItem('hmm_ai_provider', provider);
  if (geminiKey !== undefined) localStorage.setItem('hmm_gemini_api_key', geminiKey.trim());
  if (openaiKey !== undefined) localStorage.setItem('hmm_openai_api_key', openaiKey.trim());
}

/**
 * Test API Key validity
 */
export async function testAIConnection(provider, apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Chưa cung cấp API Key');
  }

  const key = apiKey.trim();

  if (provider === AI_PROVIDERS.GEMINI) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Trả lời đúng 1 từ "OK" để kiểm tra kết nối.' }]
          }
        ],
        generationConfig: { maxOutputTokens: 10 }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData?.error?.message || response.statusText;
      throw new Error(`Gemini API Error (${response.status}): ${message}`);
    }
    return { success: true, message: 'Kết nối Google Gemini thành công!' };
  } 
  
  if (provider === AI_PROVIDERS.OPENAI) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Trả lời đúng 1 từ "OK" để kiểm tra kết nối.' }],
        max_tokens: 10
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData?.error?.message || response.statusText;
      throw new Error(`OpenAI API Error (${response.status}): ${message}`);
    }
    return { success: true, message: 'Kết nối OpenAI thành công!' };
  }

  throw new Error('Nhà cung cấp không hợp lệ');
}

/**
 * Auto layout nodes into balanced Left-Right mind map branches
 */
function layoutNodes(rootText, branches, rootId = `node-root-${Date.now()}`) {
  const nodes = [
    {
      id: rootId,
      text: rootText,
      role: 'root',
      sourceType: 'sgk',
      sourceQuote: `Chủ đề chính: ${rootText}`,
      parentId: null,
      x: 0,
      y: 0,
      note: 'Ý trung tâm: Khái niệm cốt lõi của bài học'
    }
  ];

  const totalBranches = branches.length;
  branches.forEach((branch, index) => {
    const isLeft = index % 2 === 0;
    const sideIndex = Math.floor(index / 2);
    const totalOnSide = Math.ceil(totalBranches / 2);
    const ySpacing = 130;
    const yPos = (sideIndex - (totalOnSide - 1) / 2) * ySpacing;

    const branchId = `node-m-${Date.now()}-${index}`;
    nodes.push({
      id: branchId,
      text: branch.title,
      role: 'main',
      sourceType: branch.sourceType || 'sgk',
      sourceQuote: branch.sourceQuote || branch.note || '',
      parentId: rootId,
      x: isLeft ? -290 : 290,
      y: Math.round(yPos),
      note: branch.note || branch.title
    });

    if (Array.isArray(branch.subBranches)) {
      const subCount = branch.subBranches.length;
      branch.subBranches.forEach((sub, subIdx) => {
        const subY = yPos + (subIdx - (subCount - 1) / 2) * 55;
        nodes.push({
          id: `node-s-${Date.now()}-${index}-${subIdx}`,
          text: sub.text,
          role: 'sub',
          sourceType: sub.sourceType || branch.sourceType || 'sgk',
          sourceQuote: sub.sourceQuote || sub.note || '',
          parentId: branchId,
          x: isLeft ? -560 : 560,
          y: Math.round(subY),
          note: sub.note || sub.text
        });
      });
    }
  });

  return nodes;
}

/**
 * Generate Mind Map with AI (Gemini or OpenAI)
 */
export async function generateMindMapFromAI({
  topic,
  subject,
  grade,
  scope = 'standard',
  lessonText = '',
  imagePreview = null
}) {
  const config = getAIConfig();
  if (!config.hasKey) {
    throw new Error('Chưa cấu hình API Key. Vui lòng nhập API Key trong file .env hoặc cài đặt trên giao diện!');
  }

  let targetBranches = 4;
  if (scope === 'small') targetBranches = 3;
  if (scope === 'chapter') targetBranches = 6;

  const systemInstruction = `Bạn là một chuyên gia sư phạm và chuyên gia vẽ sơ đồ tư duy (Mind Map) theo chuẩn chương trình Giáo dục Việt Nam (Bộ GD&ĐT).
Nhiệm vụ của bạn: Tạo sơ đồ tư duy cấu trúc bài học bám sát nội dung Sách giáo khoa (SGK).

Quy tắc bắt buộc:
1. Số lượng nhánh chính (main branches): từ ${targetBranches} đến ${targetBranches + 1} nhánh.
2. Tiêu đề nhánh chính (title): CỰC KỲ NGẮN GỌN, dưới 8 từ, là các từ khóa / khái niệm / mục lớn.
3. Mỗi nhánh chính có từ 1 đến 3 nhánh con (subBranches) làm rõ khái niệm, công thức hoặc ví dụ.
4. Gắn nguồn SGK: Các ý lấy từ bài học thì gán sourceType: "sgk" kèm trích dẫn ngắn (sourceQuote).
5. Phân định rõ ý mở rộng: BẮT BUỘC có đúng 1 nhánh con hoặc nhánh chính ứng dụng thực tế ngoài SGK, đánh dấu rõ sourceType: "ai_ext", sourceQuote: "AI gợi ý mở rộng ngoài SGK", note: "Ý này AI tự đề xuất ngoài SGK để học sinh liên hệ thực tế".
6. Toàn bộ ngôn ngữ là tiếng Việt chuẩn mực, sư phạm.

BẮT BUỘC TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON NHƯ SAU, KHÔNG THÊM BẤT KỲ VĂN BẢN NÀO NGOÀI JSON:
{
  "topic": "Tên bài học",
  "summary": "Tóm tắt ngắn gọn 1-2 câu",
  "branches": [
    {
      "title": "Tiêu đề nhánh chính 1 (dưới 8 từ)",
      "sourceType": "sgk",
      "sourceQuote": "Trích đoạn SGK liên quan",
      "note": "Ghi chú ngắn",
      "subBranches": [
        {
          "text": "Ý cụ thể 1",
          "sourceType": "sgk",
          "sourceQuote": "Trích dẫn nếu có",
          "note": "Ghi chú giải thích"
        }
      ]
    },
    {
      "title": "Ứng dụng & Mở rộng thực tế",
      "sourceType": "ai_ext",
      "sourceQuote": "AI gợi ý mở rộng ngoài SGK",
      "note": "AI mở rộng",
      "subBranches": [
        {
          "text": "Liên hệ thực tiễn đời sống hàng ngày",
          "sourceType": "ai_ext",
          "sourceQuote": "AI gợi ý mở rộng ngoài SGK",
          "note": "Ý tham khảo thêm"
        }
      ]
    }
  ]
}`;

  const promptText = `Hãy tạo sơ đồ tư duy cho bài học:
- Chủ đề: ${topic}
- Môn học: ${subject}
- Khối lớp: Lớp ${grade}
- Phạm vi bài học: ${scope === 'small' ? 'Mục nhỏ' : scope === 'chapter' ? 'Cả chương' : 'Cả bài học'}
${lessonText ? `\n- Nội dung văn bản SGK / tài liệu cung cấp:\n"""\n${lessonText}\n"""` : '\n(Không có văn bản đính kèm, hãy bám sát kiến thức chuẩn SGK hiện hành)'}
${imagePreview ? '\n(Có ảnh chụp trang sách đính kèm, hãy nhận dạng chữ và trích xuất kiến thức chuẩn xác từ ảnh)' : ''}`;

  let parsedData = null;

  if (config.provider === AI_PROVIDERS.GEMINI) {
    parsedData = await callGeminiAPI(config.activeKey, systemInstruction, promptText, imagePreview);
  } else {
    parsedData = await callOpenAIAPI(config.activeKey, systemInstruction, promptText, imagePreview);
  }

  // Validate and build final lesson structure
  const rootId = `node-ai-${Date.now()}`;
  const finalTopic = parsedData.topic || topic;
  const nodes = layoutNodes(finalTopic, parsedData.branches || [], rootId);

  return {
    id: `lesson-${Date.now()}`,
    title: finalTopic,
    subject,
    grade,
    scope,
    role: 'student',
    updatedAt: 'Vừa xong',
    createdAt: 'Vừa tạo bằng AI',
    description: parsedData.summary || `Sơ đồ tư duy AI tạo từ nội dung ${topic}.`,
    textbookSource: lessonText || `Nguồn SGK ${subject} Lớp ${grade}: ${topic}`,
    quickNote: 'Sơ đồ đã được gắn nhãn nguồn. Hãy bấm vào từng nút để đối chiếu với SGK và ghi chú thêm.',
    rootNodeId: rootId,
    nodes,
    crossLinks: []
  };
}

/**
 * Call Google Gemini REST API (Gemini 1.5 Flash / 2.0)
 */
async function callGeminiAPI(apiKey, systemInstruction, promptText, imagePreview) {
  // Try 2.0-flash first, fallback to 1.5-flash
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      
      const parts = [];
      
      // If image is provided, parse base64
      if (imagePreview && imagePreview.startsWith('data:')) {
        const match = imagePreview.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          parts.push({
            inlineData: {
              mimeType: match[1],
              data: match[2]
            }
          });
        }
      }

      parts.push({ text: `${systemInstruction}\n\n${promptText}` });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3
          }
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Lỗi Gemini (${response.status})`);
      }

      const resData = await response.json();
      const rawText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('AI không trả về nội dung');

      const jsonClean = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      return JSON.parse(jsonClean);
    } catch (err) {
      lastError = err;
      // If model not found or error, try next model
    }
  }

  throw lastError || new Error('Không thể kết nối đến Google Gemini');
}

/**
 * Call OpenAI API (GPT-4o-mini)
 */
async function callOpenAIAPI(apiKey, systemInstruction, promptText, imagePreview) {
  const url = 'https://api.openai.com/v1/chat/completions';

  const userContent = [];
  if (imagePreview && imagePreview.startsWith('data:')) {
    userContent.push({
      type: 'image_url',
      image_url: { url: imagePreview }
    });
  }
  userContent.push({ type: 'text', text: promptText });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userContent }
      ]
    })
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson?.error?.message || `Lỗi OpenAI (${response.status})`);
  }

  const resData = await response.json();
  const rawText = resData?.choices?.[0]?.message?.content;
  if (!rawText) throw new Error('OpenAI không trả về nội dung');

  return JSON.parse(rawText);
}
