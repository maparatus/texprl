#!/usr/bin/env sh
docker-compose -f config/docker-compose.yml run --service-ports dev bash
