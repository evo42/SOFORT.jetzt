FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY ./dist/ /var/www/html/
EXPOSE 80 80
EXPOSE 443 443
EXPOSE 9042 9042
CMD ["nginx","-g","daemon off;"]