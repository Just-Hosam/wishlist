# Playward

Playward is a full-stack video game wishlist and backlog manager built with Next.js. It lets you discover games, organize them into personal lists, compare store pricing across platforms, and access game playtime estimates and Steam review snapshots.

#### NOTES:

- Playward is feature complete, but is still being worked on — expect frequent updates!
- The best experience is via PWA: install it and add it to your Home Screen.

## Features

- Search and discovery powered by IGDB
- Quality-ranked results using ratings, recency, hype, and metadata completeness
- Personal game lists for Wishlist, Library and Completed
- "Now Playing" prioritization for active games
- Price tracking across Steam, PlayStation Store, and Nintendo eShop
- Store-aware pricing metadata, including PlayStation Plus tiers
- Time-to-beat estimates
- Steam reviews
- Search keyword suggestions and history
- Mobile-friendly PWA install support

### Manage your backlog

<p>
  <img src="public/screenshots/wishlist.PNG" alt="Wishlist page showing saved games and tracked prices" width="30%" />
  <img src="public/screenshots/library.PNG" alt="Library page showing now playing and backlog sections" width="30%" />
</p>

### Find new games

<p>
  <img src="public/screenshots/search-recommendations.PNG" alt="Discovery screen showing trending and upcoming game recommendations" width="25%" />
  <img src="public/screenshots/search-keywords.PNG" alt="Search screen showing keyword suggestions for a game query" width="25%" />
  <img src="public/screenshots/search-results.PNG" alt="Search results for Hollow Knight titles" width="25%" />
</p>

### Check out a game

<p>
  <img src="public/screenshots/game-1.PNG" alt="Game details screen with pricing and summary for Planet of Lana" width="25%" />
  <img src="public/screenshots/game-2.PNG" alt="Game details screen with media and time to beat for Planet of Lana" width="25%" />
  <img src="public/screenshots/reviews.PNG" alt="Steam reviews screen with rating and user reviews" width="25%" />
</p>

### Add it to the right list

<p>
  <img src="public/screenshots/add-to-wishlist.PNG" alt="Add to Wishlist sheet with time-to-beat and price tracking options" width="30%" />
  <img src="public/screenshots/add-to-library.PNG" alt="Add to Library sheet with platform ownership and currently playing options" width="30%" />
</p>

## Architecture Highlights

- Quality-ranked IGDB search with recency, ratings, hype, and metadata completeness
- Multi-platform pricing pulled from Steam, PlayStation Store, and Nintendo eShop
- Daily background refresh flows for pricing and curated discovery shelves
- Server actions with cache tags and `unstable_cache` for fast repeat reads
- Middleware-backed auth gating for private lists, search history, and user data
- App-like navigation with global loading states, scroll restoration, and PWA support

## Tech Stack

| Layer      | Technology                                                 |
| ---------- | ---------------------------------------------------------- |
| Framework  | Next.js 15 App Router + React 18 + TypeScript              |
| Database   | PostgreSQL + Prisma ORM                                    |
| Auth       | Auth.js / NextAuth with Google OAuth                       |
| Styling    | Tailwind CSS + Radix UI                                    |
| Game Data  | IGDB / Twitch API                                          |
| Price Data | Steam API, PlayStation Store scraping, Nintendo eShop APIs |
| Hosting    | Vercel                                                     |
