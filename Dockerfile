FROM node:fermium-alpine3.15
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "dev", "--", "--host"]
# CMD [ "npm", "run", "dev"]
