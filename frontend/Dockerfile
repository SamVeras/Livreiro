FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g serve
EXPOSE 4173
CMD ["sh", "-c", "npm run build && serve -s dist -l 4173"]