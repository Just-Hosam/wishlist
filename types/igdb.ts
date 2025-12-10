import { Platform } from "./enums"

export const IGDB_PLATFORM_MAP: Record<number, Platform> = {
  6: Platform.PC,
  48: Platform.PLAYSTATION,
  167: Platform.PLAYSTATION,
  130: Platform.NINTENDO,
  508: Platform.NINTENDO,
  169: Platform.XBOX
}

export enum IGDBWebsiteType {
  OFFICIAL = 1,
  WIKIA = 2,
  WIKIPEDIA = 3,
  FACEBOOK = 4,
  TWITTER = 5,
  TWITCH = 6,
  INSTAGRAM = 8,
  YOUTUBE = 9,
  IPHONE = 10,
  IPAD = 11,
  ANDROID = 12,
  STEAM = 13,
  REDDIT = 14,
  ITCH = 15,
  EPIC_GAMES = 16,
  GOG = 17,
  DISCORD = 18,
  PLAYSTATION = 23,
  NINTENDO = 24
}

export interface IGDBGame {
  id: string
  igdbId: number
  name: string
  slug: string
  summary: string
  coverImageId: string
  screenshotImageIds: string[]
  videoId: string | null
  platforms: Platform[]
  firstReleaseDate: number
  rating?: number | null
  ratingCount?: number | null
  aggregatedRating?: number | null
  aggregatedRatingCount?: number | null
  hypes?: number | null
  nintendoUrlSegment?: string | null
  playstationUrlSegment?: string | null
  steamUrlSegment?: string | null
}

export interface RawIGDBAPIGame {
  id: number
  name: string
  slug: string
  summary?: string
  cover?: { id: string; image_id: string }
  screenshots?: { id: string; image_id: string }[]
  videos?: { id: string; video_id: string; name: string }[]
  platforms?: { id: number }[]
  first_release_date?: number
  rating?: number
  rating_count?: number
  aggregated_rating?: number
  aggregated_rating_count?: number
  hypes?: number
  websites?: { id: string; type: number; url: string }[]
}

const game_type = [
  {
    id: 0,
    type: "Main Game"
  },
  {
    id: 1,
    type: "DLC"
  },
  {
    id: 2,
    type: "Expansion"
  },
  {
    id: 3,
    type: "Bundle"
  },
  {
    id: 4,
    type: "Standalone Expansion"
  },
  {
    id: 5,
    type: "Mod"
  },
  {
    id: 6,
    type: "Episode"
  },
  {
    id: 7,
    type: "Season"
  },
  {
    id: 8,
    type: "Remake"
  },
  {
    id: 9,
    type: "Remaster"
  },
  {
    id: 10,
    type: "Expanded Game"
  },
  {
    id: 11,
    type: "Port"
  },
  {
    id: 12,
    type: "Fork"
  },
  {
    id: 13,
    type: "Pack / Addon"
  },
  {
    id: 14,
    type: "Update"
  }
]

const platforms = [
  {
    id: 3,
    slug: "linux"
  },
  {
    id: 4,
    slug: "n64"
  },
  {
    id: 5,
    slug: "wii"
  },
  {
    id: 6,
    slug: "win"
  },
  {
    id: 7,
    slug: "ps"
  },
  {
    id: 8,
    slug: "ps2"
  },
  {
    id: 9,
    slug: "ps3"
  },
  {
    id: 11,
    slug: "xbox"
  },
  {
    id: 12,
    slug: "xbox360"
  },
  {
    id: 13,
    slug: "dos"
  },
  {
    id: 14,
    slug: "mac"
  },
  {
    id: 15,
    slug: "c64"
  },
  {
    id: 16,
    slug: "amiga"
  },
  {
    id: 18,
    slug: "nes"
  },
  {
    id: 19,
    slug: "snes"
  },
  {
    id: 20,
    slug: "nds"
  },
  {
    id: 21,
    slug: "ngc"
  },
  {
    id: 22,
    slug: "gbc"
  },
  {
    id: 23,
    slug: "dc"
  },
  {
    id: 24,
    slug: "gba"
  },
  {
    id: 25,
    slug: "acpc"
  },
  {
    id: 26,
    slug: "zxs"
  },
  {
    id: 27,
    slug: "msx"
  },
  {
    id: 29,
    slug: "genesis-slash-megadrive"
  },
  {
    id: 30,
    slug: "sega32"
  },
  {
    id: 32,
    slug: "saturn"
  },
  {
    id: 33,
    slug: "gb"
  },
  {
    id: 34,
    slug: "android"
  },
  {
    id: 35,
    slug: "gamegear"
  },
  {
    id: 37,
    slug: "3ds"
  },
  {
    id: 38,
    slug: "psp"
  },
  {
    id: 39,
    slug: "ios"
  },
  {
    id: 41,
    slug: "wiiu"
  },
  {
    id: 42,
    slug: "ngage"
  },
  {
    id: 44,
    slug: "zod"
  },
  {
    id: 46,
    slug: "psvita"
  },
  {
    id: 47,
    slug: "vc"
  },
  {
    id: 48,
    slug: "ps4--1"
  },
  {
    id: 49,
    slug: "xboxone"
  },
  {
    id: 50,
    slug: "3do"
  },
  {
    id: 51,
    slug: "fds"
  },
  {
    id: 52,
    slug: "arcade"
  },
  {
    id: 53,
    slug: "msx2"
  },
  {
    id: 55,
    slug: "mobile"
  },
  {
    id: 57,
    slug: "wonderswan"
  },
  {
    id: 58,
    slug: "sfam"
  },
  {
    id: 59,
    slug: "atari2600"
  },
  {
    id: 60,
    slug: "atari7800"
  },
  {
    id: 61,
    slug: "lynx"
  },
  {
    id: 62,
    slug: "jaguar"
  },
  {
    id: 63,
    slug: "atari-st"
  },
  {
    id: 64,
    slug: "sms"
  },
  {
    id: 65,
    slug: "atari8bit"
  },
  {
    id: 66,
    slug: "atari5200"
  },
  {
    id: 67,
    slug: "intellivision"
  },
  {
    id: 68,
    slug: "colecovision"
  },
  {
    id: 69,
    slug: "bbcmicro"
  },
  {
    id: 70,
    slug: "vectrex"
  },
  {
    id: 71,
    slug: "vic-20"
  },
  {
    id: 72,
    slug: "ouya"
  },
  {
    id: 73,
    slug: "blackberry"
  },
  {
    id: 74,
    slug: "winphone"
  },
  {
    id: 75,
    slug: "appleii"
  },
  {
    id: 77,
    slug: "x1"
  },
  {
    id: 78,
    slug: "sega-cd"
  },
  {
    id: 79,
    slug: "neogeomvs"
  },
  {
    id: 80,
    slug: "neogeoaes"
  },
  {
    id: 82,
    slug: "browser"
  },
  {
    id: 84,
    slug: "sg1000"
  },
  {
    id: 85,
    slug: "donner30"
  },
  {
    id: 86,
    slug: "turbografx16--1"
  },
  {
    id: 87,
    slug: "virtualboy"
  },
  {
    id: 88,
    slug: "odyssey--1"
  },
  {
    id: 89,
    slug: "microvision--1"
  },
  {
    id: 90,
    slug: "cpet"
  },
  {
    id: 91,
    slug: "astrocade"
  },
  {
    id: 93,
    slug: "c16"
  },
  {
    id: 94,
    slug: "c-plus-4"
  },
  {
    id: 95,
    slug: "pdp1"
  },
  {
    id: 96,
    slug: "pdp10"
  },
  {
    id: 97,
    slug: "pdp-8--1"
  },
  {
    id: 98,
    slug: "gt40"
  },
  {
    id: 99,
    slug: "famicom"
  },
  {
    id: 100,
    slug: "analogueelectronics"
  },
  {
    id: 101,
    slug: "nimrod"
  },
  {
    id: 102,
    slug: "edsac--1"
  },
  {
    id: 103,
    slug: "pdp-7--1"
  },
  {
    id: 104,
    slug: "hp2100"
  },
  {
    id: 105,
    slug: "hp3000"
  },
  {
    id: 106,
    slug: "sdssigma7"
  },
  {
    id: 107,
    slug: "call-a-computer"
  },
  {
    id: 108,
    slug: "pdp11"
  },
  {
    id: 109,
    slug: "cdccyber70"
  },
  {
    id: 110,
    slug: "plato--1"
  },
  {
    id: 111,
    slug: "imlac-pds1"
  },
  {
    id: 112,
    slug: "microcomputer--1"
  },
  {
    id: 113,
    slug: "onlive"
  },
  {
    id: 114,
    slug: "amiga-cd32"
  },
  {
    id: 115,
    slug: "apple-iigs"
  },
  {
    id: 116,
    slug: "acorn-archimedes"
  },
  {
    id: 117,
    slug: "philips-cdi"
  },
  {
    id: 118,
    slug: "fm-towns"
  },
  {
    id: 119,
    slug: "neo-geo-pocket"
  },
  {
    id: 120,
    slug: "neo-geo-pocket-color"
  },
  {
    id: 121,
    slug: "sharp-x68000"
  },
  {
    id: 122,
    slug: "nuon"
  },
  {
    id: 123,
    slug: "wonderswan-color"
  },
  {
    id: 124,
    slug: "swancrystal"
  },
  {
    id: 125,
    slug: "pc-8800-series"
  },
  {
    id: 126,
    slug: "trs-80"
  },
  {
    id: 127,
    slug: "fairchild-channel-f"
  },
  {
    id: 128,
    slug: "supergrafx"
  },
  {
    id: 129,
    slug: "ti-99"
  },
  {
    id: 130,
    slug: "switch"
  },
  {
    id: 131,
    slug: "super-nes-cd-rom-system"
  },
  {
    id: 132,
    slug: "firetv"
  },
  {
    id: 133,
    slug: "odyssey-2-slash-videopac-g7000"
  },
  {
    id: 134,
    slug: "acorn-electron"
  },
  {
    id: 135,
    slug: "hyper-neo-geo-64"
  },
  {
    id: 136,
    slug: "neo-geo-cd"
  },
  {
    id: 137,
    slug: "new-3ds"
  },
  {
    id: 138,
    slug: "vc-4000"
  },
  {
    id: 139,
    slug: "1292-advanced-programmable-video-system"
  },
  {
    id: 140,
    slug: "ay-3-8500"
  },
  {
    id: 141,
    slug: "ay-3-8610"
  },
  {
    id: 142,
    slug: "pc-50x-family"
  },
  {
    id: 143,
    slug: "ay-3-8760"
  },
  {
    id: 144,
    slug: "ay-3-8710"
  },
  {
    id: 145,
    slug: "ay-3-8603"
  },
  {
    id: 146,
    slug: "ay-3-8605"
  },
  {
    id: 147,
    slug: "ay-3-8606"
  },
  {
    id: 148,
    slug: "ay-3-8607"
  },
  {
    id: 149,
    slug: "pc-9800-series"
  },
  {
    id: 150,
    slug: "turbografx-16-slash-pc-engine-cd"
  },
  {
    id: 151,
    slug: "trs-80-color-computer"
  },
  {
    id: 152,
    slug: "fm-7"
  },
  {
    id: 153,
    slug: "dragon-32-slash-64"
  },
  {
    id: 154,
    slug: "apcw"
  },
  {
    id: 155,
    slug: "tatung-einstein"
  },
  {
    id: 156,
    slug: "thomson-mo5"
  },
  {
    id: 157,
    slug: "nec-pc-6000-series"
  },
  {
    id: 158,
    slug: "commodore-cdtv"
  },
  {
    id: 159,
    slug: "nintendo-dsi"
  },
  {
    id: 161,
    slug: "windows-mixed-reality"
  },
  {
    id: 162,
    slug: "oculus-vr"
  },
  {
    id: 163,
    slug: "steam-vr"
  },
  {
    id: 164,
    slug: "daydream"
  },
  {
    id: 165,
    slug: "psvr"
  },
  {
    id: 166,
    slug: "pokemon-mini"
  },
  {
    id: 167,
    slug: "ps5"
  },
  {
    id: 169,
    slug: "series-x-s"
  },
  {
    id: 170,
    slug: "stadia"
  },
  {
    id: 203,
    slug: "duplicate-stadia"
  },
  {
    id: 236,
    slug: "exidy-sorcerer"
  },
  {
    id: 237,
    slug: "sol-20"
  },
  {
    id: 238,
    slug: "dvd-player"
  },
  {
    id: 239,
    slug: "blu-ray-player"
  },
  {
    id: 240,
    slug: "zeebo"
  },
  {
    id: 274,
    slug: "pc-fx"
  },
  {
    id: 306,
    slug: "satellaview"
  },
  {
    id: 307,
    slug: "g-and-w"
  },
  {
    id: 308,
    slug: "playdia"
  },
  {
    id: 309,
    slug: "evercade"
  },
  {
    id: 339,
    slug: "sega-pico"
  },
  {
    id: 372,
    slug: "ooparts"
  },
  {
    id: 373,
    slug: "sinclair-zx81"
  },
  {
    id: 374,
    slug: "sharp-mz-2200"
  },
  {
    id: 375,
    slug: "epoch-cassette-vision"
  },
  {
    id: 376,
    slug: "epoch-super-cassette-vision"
  },
  {
    id: 377,
    slug: "plug-and-play"
  },
  {
    id: 378,
    slug: "gamate"
  },
  {
    id: 379,
    slug: "game-dot-com"
  },
  {
    id: 380,
    slug: "casio-loopy"
  },
  {
    id: 381,
    slug: "playdate"
  },
  {
    id: 382,
    slug: "intellivision-amico"
  },
  {
    id: 384,
    slug: "oculus-quest"
  },
  {
    id: 385,
    slug: "oculus-rift"
  },
  {
    id: 386,
    slug: "meta-quest-2"
  },
  {
    id: 387,
    slug: "oculus-go"
  },
  {
    id: 388,
    slug: "gear-vr"
  },
  {
    id: 389,
    slug: "airconsole"
  },
  {
    id: 390,
    slug: "psvr2"
  },
  {
    id: 405,
    slug: "windows-mobile"
  },
  {
    id: 406,
    slug: "sinclair-ql"
  },
  {
    id: 407,
    slug: "hyperscan"
  },
  {
    id: 408,
    slug: "mega-duck-slash-cougar-boy"
  },
  {
    id: 409,
    slug: "legacy-computer"
  },
  {
    id: 410,
    slug: "atari-jaguar-cd"
  },
  {
    id: 411,
    slug: "handheld"
  },
  {
    id: 412,
    slug: "leapster"
  },
  {
    id: 413,
    slug: "leapster-explorer-slash-leadpad-explorer"
  },
  {
    id: 414,
    slug: "leaptv"
  },
  {
    id: 415,
    slug: "watara-slash-quickshot-supervision"
  },
  {
    id: 416,
    slug: "64dd"
  },
  {
    id: 417,
    slug: "palm-os"
  },
  {
    id: 438,
    slug: "arduboy"
  },
  {
    id: 439,
    slug: "vsmile"
  },
  {
    id: 440,
    slug: "visual-memory-unit-slash-visual-memory-system"
  },
  {
    id: 441,
    slug: "pocketstation"
  },
  {
    id: 471,
    slug: "meta-quest-3"
  },
  {
    id: 472,
    slug: "visionos"
  },
  {
    id: 473,
    slug: "arcadia-2001"
  },
  {
    id: 474,
    slug: "gizmondo"
  },
  {
    id: 475,
    slug: "r-zone"
  },
  {
    id: 476,
    slug: "apple-pippin"
  },
  {
    id: 477,
    slug: "panasonic-jungle"
  },
  {
    id: 478,
    slug: "panasonic-m2"
  },
  {
    id: 479,
    slug: "terebikko-slash-see-n-say-video-phone"
  },
  {
    id: 480,
    slug: "super-acan"
  },
  {
    id: 481,
    slug: "tomy-tutor-slash-pyuta-slash-grandstand-tutor"
  },
  {
    id: 482,
    slug: "sega-cd-32x"
  },
  {
    id: 486,
    slug: "digiblast"
  },
  {
    id: 487,
    slug: "laseractive"
  },
  {
    id: 504,
    slug: "uzebox"
  },
  {
    id: 505,
    slug: "elektor-tv-games-computer"
  },
  {
    id: 506,
    slug: "gx4000"
  },
  {
    id: 507,
    slug: "advanced-pico-beena"
  },
  {
    id: 508,
    slug: "switch-2"
  },
  {
    id: 509,
    slug: "polymega"
  },
  {
    id: 510,
    slug: "e-reader-slash-card-e-reader"
  }
]

const themes = [
  {
    id: 41,
    slug: "4x-explore-expand-exploit-and-exterminate"
  },
  {
    id: 1,
    slug: "action"
  },
  {
    id: 28,
    slug: "business"
  },
  {
    id: 27,
    slug: "comedy"
  },
  {
    id: 31,
    slug: "drama"
  },
  {
    id: 34,
    slug: "educational"
  },
  {
    id: 42,
    slug: "erotic"
  },
  {
    id: 17,
    slug: "fantasy"
  },
  {
    id: 22,
    slug: "historical"
  },
  {
    id: 19,
    slug: "horror"
  },
  {
    id: 35,
    slug: "kids"
  },
  {
    id: 43,
    slug: "mystery"
  },
  {
    id: 32,
    slug: "non-fiction"
  },
  {
    id: 38,
    slug: "open-world"
  },
  {
    id: 40,
    slug: "party"
  },
  {
    id: 44,
    slug: "romance"
  },
  {
    id: 33,
    slug: "sandbox"
  },
  {
    id: 18,
    slug: "science-fiction"
  },
  {
    id: 23,
    slug: "stealth"
  },
  {
    id: 21,
    slug: "survival"
  },
  {
    id: 20,
    slug: "thriller"
  },
  {
    id: 39,
    slug: "warfare"
  }
]

const genres = [
  {
    id: 2,
    slug: "point-and-click"
  },
  {
    id: 4,
    slug: "fighting"
  },
  {
    id: 5,
    slug: "shooter"
  },
  {
    id: 7,
    slug: "music"
  },
  {
    id: 8,
    slug: "platform"
  },
  {
    id: 9,
    slug: "puzzle"
  },
  {
    id: 10,
    slug: "racing"
  },
  {
    id: 11,
    slug: "real-time-strategy-rts"
  },
  {
    id: 12,
    slug: "role-playing-rpg"
  },
  {
    id: 13,
    slug: "simulator"
  },
  {
    id: 14,
    slug: "sport"
  },
  {
    id: 15,
    slug: "strategy"
  },
  {
    id: 16,
    slug: "turn-based-strategy-tbs"
  },
  {
    id: 24,
    slug: "tactical"
  },
  {
    id: 25,
    slug: "hack-and-slash-beat-em-up"
  },
  {
    id: 26,
    slug: "quiz-trivia"
  },
  {
    id: 30,
    slug: "pinball"
  },
  {
    id: 31,
    slug: "adventure"
  },
  {
    id: 32,
    slug: "indie"
  },
  {
    id: 33,
    slug: "arcade"
  },
  {
    id: 34,
    slug: "visual-novel"
  },
  {
    id: 35,
    slug: "card-and-board-game"
  },
  {
    id: 36,
    slug: "moba"
  }
]

const video_ranks = [
  "Launch Trailer",
  "Trailer",
  "Announcement Trailer",
  "Gameplay Trailer",
  "Release Date Trailer",
  "Gameplay Video",
  "Game Intro"
]

export const IGDB_IMAGE_SIZES = {
  cover_small: { width: 90, height: 128 },
  cover_big: { width: 264, height: 374 },
  screenshot_med: { width: 569, height: 320 },
  screenshot_big: { width: 889, height: 500 },
  screenshot_huge: { width: 1280, height: 720 },
  "720p": { width: 1280, height: 720 },
  "1080p": { width: 1920, height: 1080 }
} as const
