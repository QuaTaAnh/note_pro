# Hướng dẫn cấu hình Tiptap Cloud cho Note Pro

## 🎯 Mục tiêu

Cấu hình các biến môi trường để enable collaboration và AI features trong Tiptap Notion-like Editor.

## 📋 Các biến môi trường cần cấu hình

```env
# Collaboration Configuration
NEXT_PUBLIC_TIPTAP_COLLAB_DOC_PREFIX=note-pro
NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID=your_collab_app_id_here
NEXT_PUBLIC_TIPTAP_COLLAB_TOKEN=your_collab_token_here

# AI Configuration
NEXT_PUBLIC_TIPTAP_AI_APP_ID=your_ai_app_id_here
NEXT_PUBLIC_TIPTAP_AI_TOKEN=your_ai_token_here
```

## 🚀 Bước 1: Đăng ký Tiptap Cloud

### 1.1 Truy cập và đăng ký

- **URL**: [https://cloud.tiptap.dev](https://cloud.tiptap.dev)
- **Đăng ký** tài khoản mới hoặc **đăng nhập**
- **Chọn plan**: Bắt đầu với Free plan để test

### 1.2 Tạo Project

1. Click **"Create new project"**
2. **Đặt tên**: `note-pro` (hoặc tên bạn muốn)
3. **Chọn plan**: Free plan để bắt đầu
4. Click **"Create project"**

## 🔧 Bước 2: Cấu hình Collaboration Service

### 2.1 Mở Collaboration Service

1. Trong dashboard, tìm **"Collaboration"** service
2. Click vào **Collaboration** để mở cấu hình

### 2.2 Lấy App ID

1. Trong trang Collaboration, tìm **"App ID"**
2. **Copy App ID** này
3. Đặt vào `NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID`

### 2.3 Cấu hình Document Prefix

1. Tìm phần **"Document Prefix"** hoặc **"Settings"**
2. **Đặt prefix**: `note-pro` (hoặc prefix bạn muốn)
3. Đây chính là giá trị cho `NEXT_PUBLIC_TIPTAP_COLLAB_DOC_PREFIX`

### 2.4 Tạo JWT Token

1. Tìm phần **"JWT Tokens"** hoặc **"Authentication"**
2. Click **"Generate Token"** hoặc **"Create Token"**
3. **Copy token** này
4. Đặt vào `NEXT_PUBLIC_TIPTAP_COLLAB_TOKEN`

## 🤖 Bước 3: Cấu hình AI Service

### 3.1 Mở AI Service

1. Trong dashboard, tìm **"AI"** service
2. Click vào **AI** để mở cấu hình

### 3.2 Lấy AI App ID

1. Trong trang AI, tìm **"App ID"**
2. **Copy App ID** này
3. Đặt vào `NEXT_PUBLIC_TIPTAP_AI_APP_ID`

### 3.3 Tạo AI JWT Token

1. Tìm phần **"JWT Tokens"** hoặc **"Authentication"**
2. Click **"Generate Token"** hoặc **"Create Token"**
3. **Copy token** này
4. Đặt vào `NEXT_PUBLIC_TIPTAP_AI_TOKEN`

## 📝 Bước 4: Tạo file .env.local

Tạo file `.env.local` trong thư mục `client/`:

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

## 🔍 Bước 5: Kiểm tra cấu hình

### 5.1 Restart development server

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại
npm run dev
```

### 5.2 Test collaboration

1. Mở **2 tab browser** khác nhau
2. Truy cập: `http://localhost:3000/demo/notion`
3. **Gõ text** trong tab 1
4. **Kiểm tra** xem text có xuất hiện trong tab 2 không

### 5.3 Test AI features

1. Trong editor, gõ `/` để mở slash menu
2. Tìm các AI commands như:
   - `/improve` - Cải thiện text
   - `/summarize` - Tóm tắt
   - `/translate` - Dịch thuật

## 🐛 Troubleshooting

### Lỗi thường gặp:

#### 1. "Set up your environment variables"

- **Nguyên nhân**: Chưa tạo file `.env.local`
- **Giải pháp**: Tạo file `.env.local` với đầy đủ biến môi trường

#### 2. "Authentication failed"

- **Nguyên nhân**: JWT token không hợp lệ hoặc hết hạn
- **Giải pháp**:
  - Tạo lại JWT token trong Tiptap Cloud
  - Cập nhật `NEXT_PUBLIC_TIPTAP_COLLAB_TOKEN` và `NEXT_PUBLIC_TIPTAP_AI_TOKEN`

#### 3. "Collaboration not working"

- **Nguyên nhân**: App ID hoặc Document Prefix không đúng
- **Giải pháp**:
  - Kiểm tra `NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID`
  - Kiểm tra `NEXT_PUBLIC_TIPTAP_COLLAB_DOC_PREFIX`

#### 4. "AI features not working"

- **Nguyên nhân**: AI App ID hoặc token không đúng
- **Giải pháp**:
  - Kiểm tra `NEXT_PUBLIC_TIPTAP_AI_APP_ID`
  - Kiểm tra `NEXT_PUBLIC_TIPTAP_AI_TOKEN`

### Debug steps:

1. **Kiểm tra console browser** (F12) để xem lỗi
2. **Kiểm tra Network tab** để xem API calls
3. **Restart development server** sau khi thay đổi .env
4. **Clear browser cache** nếu cần

## 📊 Kiểm tra hoạt động

### Collaboration test:

- ✅ Text sync giữa các tab
- ✅ Cursor hiển thị của user khác
- ✅ User presence (ai đang online)

### AI test:

- ✅ Slash commands hoạt động
- ✅ AI responses xuất hiện
- ✅ Text improvement hoạt động

## 🔒 Security Notes

### Development:

- Sử dụng JWT tokens từ Tiptap Cloud dashboard
- Tokens này có thời hạn ngắn, chỉ dùng để test

### Production:

- **KHÔNG** sử dụng hardcoded tokens
- Implement API endpoints để generate JWT tokens
- Set `NEXT_PUBLIC_USE_JWT_TOKEN_API_ENDPOINT=true`
- Tạo `/api/collaboration` và `/api/ai` endpoints

## 📚 Tài liệu tham khảo

- [Tiptap Cloud Documentation](https://tiptap.dev/docs/cloud)
- [Collaboration Setup](https://tiptap.dev/docs/editor/extensions/collaboration)
- [AI Extension](https://tiptap.dev/docs/editor/extensions/ai)
- [JWT Authentication](https://tiptap.dev/docs/cloud/authentication)

## 🎯 Next Steps

Sau khi cấu hình xong:

1. **Test tất cả features** (collaboration, AI, formatting)
2. **Customize UI** theo brand của bạn
3. **Implement image upload** nếu cần
4. **Deploy to production** với proper JWT authentication
