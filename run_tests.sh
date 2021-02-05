#!/bin/bash
docker run --rm --name cosmonaut-front-tests -v ${PWD}:/project -e RUNDIR=/project -e WEBDRIVER_VERSION=12.1.7 -u root wintermutetec/protractor:v5.4.x
