export interface IUser {
  uid: string;
  username: string;
  email: string;
  city: string;
  town: string;
  avatarUrl?: string;
  likedPosts?: string[];
  likedDiscovers?: string[];
}

export interface IPost {
  id?: string;
  uid: string;
  town: string;
  likeCount: number;
  content: string;
  imageUrl?: string;
  createdAt: number;
  commentsId: string[];
}

export interface IComment {
  id: string;
  uid: string;
  content: string;
  createdAt: number;
  user: IUser;
}

export interface IHeaderState {
  title?: string;
  profileUserName?: string;
}
