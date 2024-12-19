#!/bin/sh

# Check if certificates exist
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  # Request new certificates
  certbot certonly --webroot -w /var/www/certbot -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL
else
  echo "Certificates already exist, skipping initial certificate request."
fi

exec "$@"