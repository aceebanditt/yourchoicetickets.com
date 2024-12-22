export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  preferences?: {
    favoriteCategories?: string[];
    notifications?: boolean;
  };
}

export interface UserProfile extends User {
  orders: Order[];
  savedEvents: string[];
}