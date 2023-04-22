export interface Post {
  comment_count: number;
  like_count: number;
  profile: any;
  profile_id: number;
  text: string;
  create: Date;
  edit: Date;
  file?: string;
  id: number;
}
