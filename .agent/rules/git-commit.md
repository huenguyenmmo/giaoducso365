---
trigger: always_on
---

# Nguyên tắc Git Commit & Tự Động Push Code

## 1. Commit Message bằng Tiếng Việt

Khi commit và push code lên GitHub, **luôn viết commit message bằng tiếng Việt**, mô tả rõ ràng và dễ hiểu những thay đổi của phiên bản.

### Quy tắc:
1. **Ngôn ngữ**: Tiếng Việt, không dùng tiếng Anh
2. **Rõ ràng**: Ghi chú cụ thể những gì đã thay đổi, thêm mới, sửa lỗi
3. **Dễ hiểu**: Người không chuyên kỹ thuật cũng hiểu được

### Ví dụ:
```
✅ Đúng:
git commit -m "Thêm tính năng vòng lặp chiến dịch: gửi nhiều tin mẫu, tự thu hồi trước khi gửi tin mới"
git commit -m "Sửa lỗi thu hồi tin nhắn: chuyển từ deleteMessage sang undo API"
git commit -m "Giảm thời gian chờ giữa các nhóm từ 2.5s xuống 1.5s"

❌ Sai:
git commit -m "feat: add campaign loop"
git commit -m "fix bug"
git commit -m "update"
```

## 2. Quy Trình Tự Động Hóa Kiểm Thử & Auto Push (Pipeline)

Mọi thao tác đẩy code lên repository GitHub `https://github.com/huenguyenmmo/giaoducso365` được tự động hóa qua script:

```powershell
powershell -ExecutionPolicy Bypass -File .agent/scripts/auto_deploy_pipeline.ps1 -CommitMsg "<Thông điệp tiếng Việt>"
```

Script này tự động kích hoạt 5 bước:
1. **Security & .env Scan**: Ngăn chặn tuyệt đối việc lộ file `.env` hoặc bí mật nhạy cảm.
2. **Code Quality**: Rà soát cú pháp và chuẩn hóa code.
3. **Test Suite**: Chạy bài test tự động trước khi đóng gói.
4. **Change Summary Report**: Tổng hợp danh sách file thay đổi/thêm mới/đã xóa.
5. **Auto Commit & Push**: Commit tiếng Việt và tự động push lên GitHub `origin/main`.

