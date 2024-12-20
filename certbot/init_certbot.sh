#!/bin/sh

# Check if certificates exist
if [ ! -d "/etc/letsencrypt/live/twidilers.com" ]; then
  # Request new certificates
  certbot certonly --webroot -w /var/www/certbot -d twidilers.com -d www.twidilers.com --non-interactive --agree-tos --email $EMAIL
else
  echo "Certificates already exist, skipping initial certificate request."
fi

exec "$@"