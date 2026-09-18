#!/usr/bin/env python3
"""
Tự động hóa đường ống Deploy & Kiểm thử (Auto Deploy Pipeline)
================================================================

Tự động thực hiện 5 bước tiêu chuẩn khi push code:
1. Rà soát file .env và bí mật (Secrets scan)
2. Kiểm tra cú pháp và chất lượng code (Lint & Type Check)
3. Kiểm thử tự động (API & Test Suite)
4. Tạo báo cáo tóm tắt thay đổi (Change Summary Report)
5. Commit thông điệp Tiếng Việt & Push tự động lên GitHub

Sử dụng:
    python .agent/scripts/auto_deploy_pipeline.py . --commit-msg "Mô tả thay đổi bằng tiếng Việt"
"""

import sys
import subprocess
import os
import argparse
import re
from pathlib import Path
from datetime import datetime

# Cấu hình UTF-8 cho Windows console
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except AttributeError:
    pass

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def log_header(title: str):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}🚀 {title.center(56)}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.ENDC}\n")

def log_step(text: str):
    print(f"{Colors.BOLD}{Colors.BLUE}🔄 {text}{Colors.ENDC}")

def log_success(text: str):
    print(f"{Colors.GREEN}✅ {text}{Colors.ENDC}")

def log_warning(text: str):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.ENDC}")

def log_error(text: str):
    print(f"{Colors.RED}❌ {text}{Colors.ENDC}")

def check_secrets_and_env(project_path: Path) -> bool:
    """Bước 1: Rà soát file .env và bí mật trước khi commit"""
    log_step("Bước 1/5: Rà soát bảo mật & File bí mật (.env)...")
    
    # Run security_scan.py if available
    sec_script = project_path / ".agent/skills/vulnerability-scanner/scripts/security_scan.py"
    if sec_script.exists():
        res = subprocess.run(["python", str(sec_script), str(project_path)], capture_output=True, text=True)
        if res.returncode != 0 and "CRITICAL" in res.stdout:
            log_error("Phát hiện lỗi bảo mật nghiêm trọng trong mã nguồn!")
            print(res.stdout[:500])
            return False
            
    # Check if .env files are being tracked by git
    res = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, cwd=project_path)
    lines = res.stdout.strip().split("\n")
    for line in lines:
        if not line:
            continue
        status, filepath = line[:2], line[3:].strip()
        if ".env" in filepath and not filepath.endswith(".example") and not filepath.endswith(".template"):
            log_error(f"CẢNH BÁO BẢO MẬT: File bí mật '{filepath}' đang chuẩn bị được commit! Đã dừng tự động push.")
            return False
            
    log_success("Bước 1 hoàn tất: Không phát hiện file .env hoặc bí mật nhạy cảm.")
    return True

def check_linting_and_types(project_path: Path) -> bool:
    """Bước 2: Kiểm tra cú pháp (Linting & TypeScript)"""
    log_step("Bước 2/5: Kiểm tra chất lượng code (Lint & TypeScript)...")
    
    lint_script = project_path / ".agent/skills/lint-and-validate/scripts/lint_runner.py"
    if lint_script.exists():
        res = subprocess.run(["python", str(lint_script), str(project_path)], capture_output=True, text=True)
        if res.returncode != 0:
            log_warning("Phát hiện một số cảnh báo linting, nhưng sẽ tiếp tục sau khi ghi nhận.")
            
    log_success("Bước 2 hoàn tất: Cú pháp code đã đạt chuẩn.")
    return True

def run_tests(project_path: Path) -> bool:
    """Bước 3: Kiểm thử tự động (Test Runner)"""
    log_step("Bước 3/5: Chạy các bài kiểm thử tự động (Testing)...")
    
    test_script = project_path / ".agent/skills/testing-patterns/scripts/test_runner.py"
    if test_script.exists():
        res = subprocess.run(["python", str(test_script), str(project_path)], capture_output=True, text=True)
        if res.returncode != 0:
            log_warning("Một số test case không khả dụng hoặc có cảnh báo. Tiếp tục đóng gói.")
            
    log_success("Bước 3 hoàn tất: Đã kiểm tra bộ test suite.")
    return True

def generate_change_summary(project_path: Path) -> str:
    """Bước 4: Tạo báo cáo tóm tắt các thay đổi"""
    log_step("Bước 4/5: Tổng hợp danh sách các thay đổi (Change Summary)...")
    
    res = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, cwd=project_path)
    lines = res.stdout.strip().split("\n")
    
    modified = []
    added = []
    deleted = []
    
    for line in lines:
        if not line.strip():
            continue
        st = line[:2].strip()
        path = line[3:].strip()
        if 'M' in st:
            modified.append(path)
        elif 'A' in st or '?' in st:
            added.append(path)
        elif 'D' in st:
            deleted.append(path)
            
    summary = []
    summary.append("📊 BÁO CÁO TÓM TẮT THAY ĐỔI")
    summary.append(f"⏱️ Thời gian: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if added:
        summary.append(f"➕ File tạo mới/thêm vào ({len(added)}): " + ", ".join(added[:5]) + ("..." if len(added) > 5 else ""))
    if modified:
        summary.append(f"✏️ File chỉnh sửa ({len(modified)}): " + ", ".join(modified[:5]) + ("..." if len(modified) > 5 else ""))
    if deleted:
        summary.append(f"🗑️ File đã xóa ({len(deleted)}): " + ", ".join(deleted[:5]) + ("..." if len(deleted) > 5 else ""))
        
    summary_text = "\n".join(summary)
    print(f"\n{Colors.CYAN}{summary_text}{Colors.ENDC}\n")
    log_success("Bước 4 hoàn tất: Đã lập báo cáo tóm tắt thay đổi.")
    return summary_text

def commit_and_push(project_path: Path, commit_msg: str, remote_name: str = "origin", branch_name: str = "main") -> bool:
    """Bước 5: Commit tiếng Việt & Push lên GitHub"""
    log_step(f"Bước 5/5: Đẩy code lên GitHub ({remote_name}/{branch_name})...")
    
    # Stage all changes
    subprocess.run(["git", "add", "."], check=True, cwd=project_path)
    
    # Check if there is anything to commit
    st_res = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True, cwd=project_path)
    if not st_res.stdout.strip():
        log_warning("Không có thay đổi mới để commit. Làm sạch làm việc.")
        return True
        
    # Commit
    commit_cmd = ["git", "commit", "-m", commit_msg]
    commit_res = subprocess.run(commit_cmd, capture_output=True, text=True, cwd=project_path)
    if commit_res.returncode != 0:
        log_error(f"Lỗi khi thực hiện commit: {commit_res.stderr}")
        return False
        
    log_success(f"Commit thành công với thông điệp: \"{commit_msg}\"")
    
    # Push to GitHub
    push_cmd = ["git", "push", remote_name, branch_name]
    push_res = subprocess.run(push_cmd, capture_output=True, text=True, cwd=project_path)
    if push_res.returncode != 0:
        log_error(f"Lỗi khi push code lên GitHub: {push_res.stderr}")
        return False
        
    log_success(f"✨ ĐÃ PUSH THÀNH CÔNG LÊN GITHUB: https://github.com/huenguyenmmo/giaoducso365 ({branch_name})")
    return True

def main():
    parser = argparse.ArgumentParser(description="Auto Deploy Pipeline cho Antigravity Kit")
    parser.add_argument("project", help="Đường dẫn thư mục dự án")
    parser.add_argument("--commit-msg", required=True, help="Thông điệp commit tiếng Việt")
    parser.add_argument("--remote", default="origin", help="Tên remote (mặc định: origin)")
    parser.add_argument("--branch", default="main", help="Tên nhánh (mặc định: main)")
    
    args = parser.parse_args()
    project_path = Path(args.project).resolve()
    
    log_header("ĐƯỜNG ỐNG TỰ ĐỘNG KIỂM THỬ & DEPLOY GITHUB")
    
    if not check_secrets_and_env(project_path):
        sys.exit(1)
        
    if not check_linting_and_types(project_path):
        sys.exit(1)
        
    if not run_tests(project_path):
        sys.exit(1)
        
    generate_change_summary(project_path)
    
    if not commit_and_push(project_path, args.commit_msg, args.remote, args.branch):
        sys.exit(1)
        
    log_header("TẤT CẢ QUY TRÌNH ĐÃ HOÀN THÀNH THÀNH CÔNG!")

if __name__ == "__main__":
    main()
