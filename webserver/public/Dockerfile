FROM nginx:1.15.9-alpine
ARG APPLICATION
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY dist/ .
RUN ls -laR .
EXPOSE 80
