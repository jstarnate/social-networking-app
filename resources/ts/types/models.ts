export interface User {
    full_name: string | null;
    username: string | null;
    gender: 'Male' | 'Female' | null;
    image_url: string | null;
    url?: string;
    followed?: boolean;
}

export interface UserWithId extends User {
    id: number;
}

export interface Post {
    id: number;
    body: string;
    from_self: boolean;
    is_liked: boolean;
    likes: number;
    comments: number;
    bookmarked: boolean;
    updated_at?: string;
    user: User;
}

export interface Comment {
    id: number;
    body: string;
    from_self: boolean;
    user: User;
}
