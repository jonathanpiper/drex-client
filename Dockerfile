FROM nginx

# adapt the `dist/` folder to the output directory your build tool uses (such as `dist/`, `build/` or `www/`).
COPY dist/ /usr/share/nginx/html

EXPOSE 80