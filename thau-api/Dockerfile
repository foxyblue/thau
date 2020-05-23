FROM node:latest as base

ENV TIME_ZONE=Europe/London
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

RUN mkdir ./src
ADD src/ ./src
ADD .prettierrc tsconfig.json tslint.json ./
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:9000/heartbeat || exit 1

FROM base as dev
CMD [ "yarn", "dev" ]

FROM base as prod

RUN yarn build

EXPOSE 9000

CMD [ "yarn", "start" ]
