## Install

```
docker run --rm -it -w /build -v "$PWD:/build:delegated" node:dubnium yarn
```

## Test

```
docker run --rm -it -w /build -v "$PWD:/build:delegated" node:dubnium yarn test
```
