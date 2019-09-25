FROM ubuntu:latest
ARG DEBIAN_FRONTEND=noninteractive
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
#ADD tmp/8.1.1 /mendix
RUN apt-get update
RUN apt-get install -y gnupg2
RUN apt-get -y install wget
RUN apt-get -y install sed
RUN sed -i '1 i\deb http://packages.mendix.com/platform/debian/ stretch main contrib non-free' /etc/apt/sources.list
RUN wget -q -O - https://packages.mendix.com/mendix-debian-archive-key.asc | apt-key add -
RUN apt-get update
RUN apt-get -y install debian-mendix-archive-keyring
RUN apt-get -y install m2ee-tools
RUN apt-get -y install curl
RUN apt-get -y install mono-devel
#RUN apt-get -y install openjdk-11-jdk
RUN apt-get -y install openjdk-11-jre-headless
#CMD [ "apt-get", "-y install curl" ]