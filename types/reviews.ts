// Steam Reviews API Sample
// https://store.steampowered.com/appreviews/2394650?json=1

type ReviewDescription =
  | "Overwhelmingly Positive"
  | "Very Positive"
  | "Positive"
  | "Mostly Positive"
  | "Mixed"
  | "Mostly Negative"
  | "Negative"
  | "Overwhelmingly Negative"
  | "No user reviews"

export interface SteamReviews {
  total: number
  description: ReviewDescription
}

export interface RawSteamReviews {
  success: number
  query_summary: {
    num_reviews: number
    review_score: number
    review_score_desc: ReviewDescription
    total_positive: number
    total_negative: number
    total_reviews: number
  }
  reviews: RawSteamReview[]
}

export interface RawSteamReview {
  recommendationid: string
  language: string
  appid: number
  review: string
  timestamp_created: number
  timestamp_updated: number
  voted_up: boolean
  votes_up: number
  votes_funny: number
  weighted_vote_score: string
  comment_count: number
  steam_purchase: boolean
  received_for_free: boolean
  refunded: boolean
  written_during_early_access: boolean
  primarily_steam_deck: boolean
  app_release_date: string
  reactions: {
    reaction_type: number
    count: number
  }[]
  csgo_disclaimer: boolean
  author: {
    steamid: string
    personaname: string
    persona_status: string
    profile_url: string
    num_games_owned: number
    num_reviews: number
    playtime_forever: number
    playtime_last_two_weeks: number
    playtime_at_review: number
    deck_playtime_at_review: number
    last_played: number
    avatar: string
  }
}
