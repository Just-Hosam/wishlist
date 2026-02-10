export interface TimeToBeat {
  story: number
  extra: number
  complete: number
}

export interface RawIGDBTimeToBeat {
  id: number
  game_id: number
  hastily: number
  normally: number
  completely: number
  count: number
  created_at: number
  updated_at: number
  checksum: string
}
