# Author: Herman Geldenhuys, Sep 24, 2019
# THIS IS A DOCKER FILE TEMPLATE WITH COMMENTS
# Use Ubuntu obviously
#FROM ubuntu:19.10
FROM dockerImage
# Apt-Get for some reason want locale settings so this is to override that during installation
ARG DEBIAN_FRONTEND=noninteractive
# Ignore warnings from apt key that might block when we add Mendix' key
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
# Example Mendix version that will be copied into the image (Runtime & Modeler)
#ADD tmp/8.1.1 /mendix
ADD runtime /mendix/runtime
ADD modeler /mendix/modeler
# Routine apt get update
RUN apt-get update
# This is required for wget for some reason
RUN apt-get install -y gnupg2
RUN apt-get -y install wget
# Let's insert  the mendix deb package at the start of our sources list
RUN apt-get -y install sed
RUN sed -i '1 i\deb http://packages.mendix.com/platform/debian/ stretch main contrib non-free' /etc/apt/sources.list
RUN wget -q -O - https://packages.mendix.com/mendix-debian-archive-key.asc | apt-key add -
RUN apt-get update
RUN apt-get -y install debian-mendix-archive-keyring
RUN apt-get -y install m2ee-tools
RUN apt-get -y install curl
RUN apt-get -y install mono-devel
#RUN apt-get -y install openjdk-11-jre-headless
#CMD [ "apt-get", "-y" ]
#RUN apt-get -y install openjdk-11-jdk