export interface User {
    full_name: string | undefined;
    username: string | undefined;
    gender: 'Male' | 'Female' | undefined;
    image_url: string | undefined;
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
