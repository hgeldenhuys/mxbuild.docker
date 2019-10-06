# Author: Herman Geldenhuys, Sep 24, 2019
# THIS IS A DOCKER FILE TEMPLATE WITH COMMENTS
# Use a base Ubuntu Image
FROM dockerImage
# Apt-Get for some reason want locale settings so this is to override that during installation
ARG DEBIAN_FRONTEND=noninteractive
# Routine apt get update
RUN apt-get update
# Install missing timezonedata linked with abovementioned issue
RUN apt-get install -y tzdata
RUN ln -fs /usr/share/zoneinfo/America/New_York /etc/localtime
RUN dpkg-reconfigure --frontend noninteractive tzdata
# Mendix version that will be copied into the image (Runtime, Modeler & Sample App)
ADD runtime /mendix/runtime
ADD modeler /mendix/modeler
ADD buildpack /mendix/buildpack
ADD app /mendix/app
ADD app /mendix/app2
# Install some basic tools we'll need. gnupg2 needed for wget
RUN apt-get install -y gnupg2
# Update apt and install some basic libraries and tools for MxBuild
RUN apt-get update
RUN apt-get -y install wget
RUN apt-get -y install tar
RUN apt-get -y install vim
#RUN apt-get -y install python3
RUN apt-get -y install git
#RUN apt-get -y install mono-mcs
RUN apt-get -y install nginx
ADD mxbuild.nginx /etc/nginx/sites-available/default
#RUN npm -g install ts-node
# Installing Java
# installJava
# Get the buildback
RUN git clone https://github.com/hgeldenhuys/cf-mendix-buildpack
#RUN git clone https://github.com/hgeldenhuys/mxbuild.api
# Set some environment variables incase the base image has different values
ENV MONO_STRICT_MS_COMPLIANT=yes
ENV TERM=xterm
ENV DATABASE_URL=sqlserver://username:password@host:port/mendix
# Make sure the builderrors.json exists, sometimes the compile command complains about this
RUN /cf-mendix-buildpack/bin/compile /mendix/app /mendix/deploy
RUN mkdir -p /tmp
RUN touch /tmp/builderrors.json
patchCommands
#RUN mkdir /t
#RUN mv /usr/lib/libgdiplus* /t/.
#RUN cp /tmp/opt/mono-3.10.0/lib/lib* /usr/lib/
WORKDIR /etc/nginx/sites-enabled
#RUN ln -s ../sites-available/default
RUN service nginx start
#RUN nginx -s reload
#RUN cd bin/compile /project /project/deploy
EXPOSE 8080
RUN update-rc.d nginx enable
WORKDIR /
CMD ["sh","-c"," service nginx start && /tmp/opt/mono-3.10.0/bin/mono --config /tmp/opt/mono-3.10.0/etc/mono/config /mendix/modeler/mxbuild.exe --java-home=/mendix/app/.local/usr/lib/jvm/jdk-8u202-oracle-x64 --java-exe-path=/mendix/app/.local/usr/lib/jvm/jdk-8u202-oracle-x64/bin/java --serve --port=6666"]
#CMD [ "service", "nginx", "start"]
#CMD [ "/tmp/opt/mono-3.10.0/bin/mono", "--config", "/tmp/opt/mono-3.10.0/etc/mono/config", "/mendix/modeler/mxbuild.exe", "--java-home=/mendix/app/.local/usr/lib/jvm/jdk-8u202-oracle-x64", "--java-exe-path=/mendix/app/.local/usr/lib/jvm/jdk-8u202-oracle-x64/bin/java", "--serve", "--port=6666"]
#CMD [  "mono", "/mendix/modeler/mxbuild.exe", "--serve", "--java-home=/usr/lib/jvm/java-11-openjdk-amd64", "--java-exe-path=/usr/lib/jvm/java-11-openjdk-amd64/bin/java", "--port=7575" ]
#RUN apt-get -y install openjdk-11-jdk
