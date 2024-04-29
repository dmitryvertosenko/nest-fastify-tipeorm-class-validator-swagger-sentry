FROM node:lts-alpine

WORKDIR /app

# Copy all required files
ADD .env ./
ADD package.json ./
ADD yarn.lock ./
ADD src ./src
ADD nest-cli.json ./
ADD tsconfig.build.json ./
ADD tsconfig.json ./

# Install dependency
RUN yarn install

# Builld app
RUN yarn build

# Remove sources
RUN rm -rf src

# Run app on port 3000
EXPOSE 3000
CMD ["node", "./dist/main.js"]
