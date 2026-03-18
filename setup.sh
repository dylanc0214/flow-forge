#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
npx -y create-vite@latest frontend --template react
cd frontend
npm install
npm install react-router-dom lucide-react
npm install -D tailwindcss@3 postcss autoprefixer @tailwindcss/forms @tailwindcss/container-queries
npx tailwindcss init -p
