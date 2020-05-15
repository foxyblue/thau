FROM node:latest as base

ENV TIME_ZONE=Europe/London
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

RUN mkdir ./src
ADD src/ ./src
ADD .prettierrc tsconfig.json tslint.json ./

FROM base as dev
CMD [ "yarn", "dev" ]

FROM base as prod

RUN yarn lint
RUN yarn prettier:check
RUN yarn build

CMD [ "yarn", "start" ]
