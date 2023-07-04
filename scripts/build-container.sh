#!/usr/bin/env bash

podman build \
    -t polkadot-staking-dashboard \
    -t psd \
    .
