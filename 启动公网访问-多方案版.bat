@echo off
chcp 65001 >nul
title DevRealm 公网访问 - 多方案自动切换

echo ========================================
echo   DevRealm 公网访问一键启动工具
echo   自动尝试多个免费隧道方案
echo ========================================
echo.

cd /d "%~dp0"

rem 检查并构建项目
if not exist "dist\index.html" (
    echo [步骤0] 正在构建项目...
    call npm run build
    if errorlevel 1 (
        echo 构建失败！
        pause
        exit /b 1
    )
)

rem 启动本地静态服务器
echo [步骤1] 启动本地静态服务器...
start "DevRealm静态服务器" /min cmd /c "cd /d ""%~dp0dist"" && python -m http.server 8080"
timeout /t 2 /nobreak >nul
echo 本地服务已就绪: http://localhost:8080
echo.

:try_serveo
echo ========================================
echo  正在尝试方案1: Serveo.net (推荐)
echo ========================================
echo.
echo 首次使用如果提示 "Are you sure you want to continue connecting?"
echo 请输入 yes 然后按回车
echo.
ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -R 80:localhost:8080 serveo.net
if errorlevel 1 (
    echo.
    echo Serveo 连接失败，正在尝试下一个方案...
    timeout /t 3 /nobreak >nul
    goto :try_localhost_run
)

:try_localhost_run
echo.
echo ========================================
echo  正在尝试方案2: localhost.run
echo ========================================
echo.
ssh -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -R 80:localhost:8080 nokey@localhost.run
if errorlevel 1 (
    echo.
    echo localhost.run 连接失败，正在尝试下一个方案...
    timeout /t 3 /nobreak >nul
    goto :try_pinggy
)

:try_pinggy
echo.
echo ========================================
echo  正在尝试方案3: Pinggy.io
echo ========================================
echo.
ssh -o StrictHostKeyChecking=accept-new -p 443 -R0:localhost:8080 a.pinggy.io
if errorlevel 1 (
    echo.
    echo 所有方案都连接失败了！
    echo 请检查网络连接，或稍后再试。
    echo.
    pause
    exit /b 1
)

echo.
echo 隧道已断开。按任意键重新连接，或关闭窗口退出。
pause >nul
goto :try_serveo
