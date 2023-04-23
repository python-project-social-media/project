export interface Post {
  comment_count: number;
  like_count: number;
  profile: any;
  profile_id: number;
  text: string;
  create: Date;
  edit: Date;
  liked: boolean;
  file?: string;
  id: number;
}
