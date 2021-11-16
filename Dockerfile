FROM node:13.12.0-alpine

WORKDIR /src

ENV PATH /node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# The actual app code
COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "start"]
