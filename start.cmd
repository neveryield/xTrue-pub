@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo xTrue 前端 (Next.js dev)
echo 工作目录: %CD%
echo 开发: Turbopack ^(npm run dev^)  默认: http://localhost:3000
echo 若 Turbo 异常可改用: npm run dev:webpack
echo API: 见 .env 中 NEXT_PUBLIC_API_URL
echo ============================================
echo.

npm run dev
