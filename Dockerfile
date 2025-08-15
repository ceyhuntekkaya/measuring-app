# Tek aşamalı basit Next.js Dockerfile
FROM node:18-alpine

# Çalışma dizinini ayarlama
WORKDIR /app

# Bağımlılık dosyalarını kopyalama
COPY package.json package-lock.json* ./

# Bağımlılıkları yükleme
RUN npm ci

# Uygulama kodunu kopyalama
COPY . .

# Uygulamayı derleme
RUN npm run build

# Port ayarını belirtme
EXPOSE 3000

# Uygulamayı başlatma
CMD ["npm", "start"]