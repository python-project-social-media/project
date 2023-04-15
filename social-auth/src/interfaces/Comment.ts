export interface Comment {
  profile_id: number;
  create: number;
  text: string;
  profile: Profile;
}

export interface Profile {
  id: number;
  interests: any[];
  user: User;
  bio: string;
  profilePhoto: null;
  profilePhotoUrl: string;
  create: string;
  edit: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  date_joined: string;
  last_login: null;
  is_authenticated: boolean;
}
