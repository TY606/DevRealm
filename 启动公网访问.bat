@echo off
chcp 65001 >nul
title DevRealm 公网访问一键启动

echo ========================================
echo   DevRealm 公网访问一键启动工具
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查项目构建...
if not exist "dist\index.html" (
    echo 正在构建项目，请稍候...
    call npm run build
    if errorlevel 1 (
        echo 构建失败！请检查错误信息。
        pause
        exit /b 1
    )
    echo 构建完成！
) else (
    echo 项目已构建，跳过构建步骤。
)
echo.

echo [2/3] 启动本地静态服务器 (端口 8080)...
start "DevRealm静态服务器" /min cmd /c "cd /d ""%~dp0dist"" && python -m http.server 8080"
timeout /t 2 /nobreak >nul
echo 本地服务器已启动: http://localhost:8080
echo.

echo [3/3] 启动公网隧道 (Serveo.net)...
echo.
echo ========================================
echo   正在连接公网隧道，请稍候...
echo ========================================
echo.
echo 提示：首次使用会提示 "Are you sure you want to continue connecting?"
echo 请输入 yes 然后按回车
echo.
echo ========================================
echo.

ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -R 80:localhost:8080 serveo.net

echo.
echo 隧道已断开。按任意键重新连接，或关闭窗口退出。
pause >nul
goto :eof
