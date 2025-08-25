# Tiptap Notion-like Editor Setup Guide

## 🎉 Cài đặt thành công!

Tiptap Notion-like Editor đã được cài đặt thành công vào dự án của bạn. Dưới đây là hướng dẫn chi tiết để hoàn thiện cấu hình:

## 📋 Các bước tiếp theo

### 1. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục `client/` với nội dung sau:

```env
# Tiptap Collaboration Configuration
NEXT_PUBLIC_TIPTAP_COLLAB_DOC_PREFIX=note-pro
NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID=your_collab_app_id_here
NEXT_PUBLIC_TIPTAP_COLLAB_TOKEN=your_collab_token_here

# Tiptap AI Configuration
NEXT_PUBLIC_TIPTAP_AI_APP_ID=your_ai_app_id_here
NEXT_PUBLIC_TIPTAP_AI_TOKEN=your_ai_token_here

# Optional: Use API endpoint for JWT tokens (recommended for production)
NEXT_PUBLIC_USE_JWT_TOKEN_API_ENDPOINT=false
```

### 2. Lấy Credentials từ Tiptap Cloud

1. Truy cập [Tiptap Cloud](https://cloud.tiptap.dev)
2. Đăng ký tài khoản hoặc đăng nhập
3. Tạo một project mới
4. Lấy các credentials cần thiết:
   - **App ID** cho Collaboration
   - **App ID** cho AI
   - **JWT Tokens** cho cả hai service

### 3. Test Editor

Sau khi cấu hình xong, bạn có thể test editor tại:

- **Demo page**: `http://localhost:3000/demo/notion`
- **Original page**: `http://localhost:3000/notion-like`

## 🚀 Sử dụng trong dự án

### Import và sử dụng component:

```tsx
import NotionEditorWrapper from "@/components/NotionEditorWrapper";

export default function MyPage() {
  return (
    <NotionEditorWrapper
      room="unique-room-id"
      placeholder="Start writing..."
      className="min-h-[500px]"
    />
  );
}
```

### Props có sẵn:

- `room`: ID duy nhất cho document (bắt buộc cho collaboration)
- `placeholder`: Text placeholder cho editor
- `className`: CSS classes tùy chỉnh

## 🔧 Tính năng có sẵn

### ✅ Đã hoạt động ngay:

- Rich text formatting (bold, italic, underline, strikethrough)
- Headings (H1-H6)
- Lists (bullet, numbered, todo)
- Code blocks với syntax highlighting
- Blockquotes
- Horizontal rules
- Text alignment
- Color highlighting và text color
- Slash commands (/)
- Drag and drop blocks
- Undo/Redo
- Dark/light mode
- Responsive design

### 🔄 Cần cấu hình thêm:

- **Real-time collaboration**: Cần Tiptap Cloud credentials
- **AI assistance**: Cần Tiptap AI credentials
- **Image upload**: Cần server endpoint
- **Emoji picker**: Hoạt động với collaboration
- **Mentions**: Hoạt động với collaboration

## 🛠️ Cấu hình nâng cao

### Image Upload

Để enable image upload, bạn cần:

1. Tạo API endpoint để handle upload
2. Cấu hình trong `src/lib/tiptap-utils.ts`
3. Tham khảo example server trong [Tiptap docs](https://tiptap.dev/docs/ui-components/templates/notion-like-editor)

### JWT Authentication (Production)

Trong production, bạn nên:

1. Tạo API endpoints để generate JWT tokens
2. Set `NEXT_PUBLIC_USE_JWT_TOKEN_API_ENDPOINT=true`
3. Implement `/api/collaboration` và `/api/ai` endpoints

## 📁 Cấu trúc files đã tạo

```
src/
├── components/
│   ├── tiptap-templates/
│   │   └── notion-like/
│   │       └── notion-like-editor.tsx
│   ├── tiptap-ui/
│   │   └── [various UI components]
│   ├── tiptap-node/
│   │   └── [node components]
│   └── NotionEditorWrapper.tsx
├── lib/
│   ├── tiptap-utils.ts
│   ├── tiptap-collab-utils.ts
│   └── tiptap-advanced-utils.ts
├── hooks/
│   └── [various hooks]
└── contexts/
    └── [various contexts]
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **"Set up your environment variables"**: Chưa cấu hình .env.local
2. **"Authentication failed"**: JWT tokens không hợp lệ hoặc hết hạn
3. **"Collaboration not working"**: Chưa cấu hình Tiptap Cloud

### Debug:

- Kiểm tra console browser để xem lỗi
- Đảm bảo tất cả environment variables đã được set
- Restart development server sau khi thay đổi .env

## 📚 Tài liệu tham khảo

- [Tiptap Notion-like Editor Docs](https://tiptap.dev/docs/ui-components/templates/notion-like-editor)
- [Tiptap Cloud](https://cloud.tiptap.dev)
- [Tiptap Extensions](https://tiptap.dev/docs/editor/extensions)

## 🎯 Next Steps

1. Cấu hình Tiptap Cloud credentials
2. Test collaboration features
3. Customize UI theo brand của bạn
4. Implement image upload
5. Add to your existing note-taking features

---

**Lưu ý**: Notion-like Editor yêu cầu Tiptap Start plan để sử dụng trong production. Bạn có thể test miễn phí trong development.
