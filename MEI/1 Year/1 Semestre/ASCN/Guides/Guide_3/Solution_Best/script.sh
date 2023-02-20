#!/bin/bash

if [ "$MIGRATE" == "true" ]; then
  echo ">>> Running migration"
  php artisan migrate
fi

if [ "$SEED" == "true" ]; then
  echo ">>> Running seed"
  php artisan db:seed
fi

echo ">>> Starting app..."
php artisan serve --host=0.0.0.0