export interface BlendItem {
  me: {
    playlistIds: string[];
  };
  friend: {
    playlistIds: string[];
  };
}

export interface UserCookie {
  accessToken?: string;
  id?: string;
  displayName?: string;
  profileImage?: string;
}
