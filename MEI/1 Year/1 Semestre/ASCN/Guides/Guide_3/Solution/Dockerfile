FROM ubuntu:20.04

# Define default values for the Enviroment Variables
ENV DB_HOST swapdb
ENV DB_DATABASE swap
ENV DB_USERNAME swapuser
ENV DB_PASSWORD secret

RUN apt-get update && \
    apt-get install -y software-properties-common

# Install app packages
RUN add-apt-repository ppa:ondrej/php && apt-get update && apt-get install -y \
   php7.4 \
   php7.4-fpm \
   php7.4-zip \
   php7.4-mbstring \
   php7.4-tokenizer \
   php7.4-mysql \
   php7.4-gd \
   php7.4-xml \
   php7.4-bcmath \
   php7.4-intl \
   php7.4-curl \
   nodejs \
   composer \
   npm

# Clone Swap repository
RUN git clone https://github.com/Hackathonners/swap.git
WORKDIR swap

# Create Swap configuration file
RUN cp .env.example .env
RUN sed -i 's/DB_HOST=127.0.0.1/DB_HOST=${DB_HOST}/g' .env
RUN sed -i 's/DB_DATABASE=homestead/DB_DATABASE=${DB_DATABASE}/g' .env
RUN sed -i 's/DB_USERNAME=homestead/DB_USERNAME=${DB_USERNAME}/g' .env
RUN sed -i 's/DB_PASSWORD=secret/DB_PASSWORD=${DB_PASSWORD}/g' .env

# Install Swap composer
RUN composer install

# Install Swap npm
RUN npm install

# Generate key Swap
RUN php artisan key:generate

# Expose port 8000
EXPOSE 8000

# Start Swap server
CMD php artisan migrate && php artisan serve --host=0.0.0.0
