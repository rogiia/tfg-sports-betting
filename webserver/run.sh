docker run --name tfg-web-server -v $PWD/public:/usr/share/nginx/html:ro -p 7080:80 -d nginx
