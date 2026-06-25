@echo off
chcp 65001 >nul
title 部署到 GitHub Pages

echo ========================================
echo   DevRealm 部署到 GitHub Pages
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 检查 gh-pages 工具...
if not exist "node_modules\gh-pages" (
    echo 正在安装 gh-pages...
    call npm install gh-pages --save-dev
    if errorlevel 1 (
        echo 安装失败！
        pause
        exit /b 1
    )
)
echo gh-pages 已就绪
echo.

echo [2/4] 构建项目...
call npm run build
if errorlevel 1 (
    echo 构建失败！请检查错误信息。
    pause
    exit /b 1
)
echo 构建完成！
echo.

echo [3/4] 检查 Git 仓库...
if not exist ".git" (
    echo 初始化 Git 仓库...
    git init
    git add .
    git commit -m "Initial commit"
    echo Git 仓库已初始化
)
echo.
echo [4/4] 部署到 GitHub Pages...
echo.
echo ========================================
echo  请确保你已经：
echo  1. 在 GitHub 上创建了仓库 DevRealm
echo  2. 已经登录了 GitHub 账号
echo ========================================
echo.
echo 如果还没有创建仓库，请先访问：
echo https://github.com/new
echo 创建一个名为 DevRealm 的公开仓库
echo.
echo 部署后访问地址：
echo https://TY606.github.io/DevRealm/
echo.

npx gh-pages -d dist

if errorlevel 1 (
    echo.
    echo 部署失败！
    echo 可能的原因：
    echo 1. 还没有在 GitHub 上创建 DevRealm 仓库
    echo 2. 没有配置 Git 远程仓库地址
    echo 3. 没有登录 GitHub 账号
    echo.
    echo 请先在 GitHub 创建仓库，然后运行：
    echo git remote add origin https://github.com/TY606/DevRealm.git
    echo git branch -M main
    echo git push -u origin main
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   部署成功！
echo ========================================
echo.
echo 访问地址：https://TY606.github.io/DevRealm/
echo.
echo 注意：GitHub Pages 可能需要 1-3 分钟才能生效
echo 如果打不开，请稍等几分钟再试
echo.
pause
