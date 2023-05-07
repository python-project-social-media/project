export interface Post {
  comment_count: number;
  like_count: number;
  profile: any;
  profile_id: number;
  text: string;
  create: string;
  edit: string;
  liked: boolean;
  file?: string;
  id: number;
}
