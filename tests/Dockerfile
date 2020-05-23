FROM node:latest

ENV TIME_ZONE=Europe/London
WORKDIR /usr/src/tests

COPY package.json yarn.lock ./

RUN yarn install
RUN mkdir ./src
ADD src/ ./src
ADD .prettierrc tsconfig.json tslint.json /usr/src/tests/

EXPOSE 10000

CMD [ "yarn", "test" ]
