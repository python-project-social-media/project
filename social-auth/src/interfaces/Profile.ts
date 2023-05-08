export interface Profile {
  id: number;
  interests: any[];
  user: User;
  bio: string;
  profilePhotoUrl: string;
  create: string;
  edit: string;
  followers: number[];
  following: number[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  date_joined: string;
  last_login: string;
  is_authenticated: boolean;
}
