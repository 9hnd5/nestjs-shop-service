FROM     node:16 as base
COPY     . /app/

FROM     base as test

FROM     base as builder
WORKDIR  /app
# RUN      npm ci && npm run build && mkdir /pkg && mv dist package.json package-lock.json /pkg/
RUN      yarn install --frozen-lockfile && yarn build && mkdir /pkg && mv dist package.json yarn.lock /pkg/



FROM     node:16
RUN      useradd -m -U -d /app -s /bin/bash app
WORKDIR  /app
COPY     --chown=app:app --from=builder /pkg /app/ 
# RUN      npm ci --production
RUN      yarn install --frozen-lockfile --production
USER     app
CMD      ["node", "dist/src/main", "2>&1"]