#!/bin/bash

# Скрипт для отправки изменений на GitHub
# Перед использованием:
# 1. Создайте personal access token на GitHub: https://github.com/settings/tokens
# 2. Дайте ему права repo
# 3. Запустите этот скрипт

echo "=== Отправка изменений на GitHub ==="

# Проверяем, есть ли изменения для коммита
if git status --porcelain | grep -q .; then
    echo "Обнаружены несохраненные изменения. Добавляем..."
    git add .
    git commit -m "feat: update Telegram bot integration"
fi

# Запрашиваем токен, если не указан
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Введите ваш GitHub personal access token:"
    read -s GITHUB_TOKEN
    echo
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Ошибка: Токен не указан."
    echo "Создайте токен на https://github.com/settings/tokens"
    exit 1
fi

# Устанавливаем remote с токеном
git remote set-url origin https://${GITHUB_TOKEN}@github.com/bbybxx/intord.git

echo "Отправляем изменения..."
if git push origin main; then
    echo "✅ Изменения успешно отправлены на GitHub!"
    
    # Возвращаем обычный URL
    git remote set-url origin https://github.com/bbybxx/intord.git
else
    echo "❌ Ошибка при отправке изменений."
    echo "Проверьте токен и права доступа."
    exit 1
fi