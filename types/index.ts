export interface BlendItem {
  me: {
    playlistId: string | null;
    playlistName: string;
    userName?: string;
  } | null;
  friend: {
    playlistId: string | null;
    playlistName: string;
    userName?: string;
  } | null;
}

export interface UserCookie {
  accessToken?: string;
  id?: string;
}
