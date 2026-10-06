#!/bin/bash

set -e

# Load the credentials and site URL used by the notification endpoint.
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

source .env

if [ -z "$CRON_SECRET" ]; then
    echo "❌ Error: CRON_SECRET not configured in .env!"
    exit 1
fi

# Collect the notification content.
read -r -p "Notification name/event key: " EVENT_KEY
read -r -p "Title: " TITLE
read -r -p "Description: " DESCRIPTION

if [ -z "$EVENT_KEY" ] || [ -z "$TITLE" ] || [ -z "$DESCRIPTION" ]; then
    echo "❌ Error: Event key, title, and description are required."
    exit 1
fi

# Show the final content before sending it to every user.
echo ""
echo "Event key: $EVENT_KEY"
echo "Title: $TITLE"
echo "Description: $DESCRIPTION"
echo ""
read -r -p "Send this notification to all users? (y/n): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "⏭️  Notification cancelled."
    exit 0
fi

# Build valid JSON without relying on manual shell escaping.
PAYLOAD=$(node -e '
process.stdout.write(JSON.stringify({
  eventKey: process.argv[1],
  title: process.argv[2],
  message: process.argv[3]
}))
' -- "$EVENT_KEY" "$TITLE" "$DESCRIPTION")

# Call the protected endpoint and print its response.
RESPONSE=$(curl -fsS \
    -X POST \
    -H "Authorization: Bearer $CRON_SECRET" \
    -H "Content-Type: application/json" \
    --data "$PAYLOAD" \
    "https://wishlist.samdahrooge.com/api/notifications/new-feature")

echo "✅ Notification request completed."
echo "$RESPONSE"
