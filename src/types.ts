export type Category = 'All' | 'Kitchen Utensils' | 'Home Interior & Decor' | 'Electrical Goods' | 'Smart Home & Lighting' | 'Fashion & Apparel' | 'Kitchen' | 'Home Interior' | 'Electrical' | 'Fashion';

export interface ProductComment {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  category: Category;
  price: number;
  originalPrice?: number;
  description: string;
  mediaUrl: string; // image or video URL
  additionalImages?: string[];
  stock: number;
  likes: string[]; // user IDs who liked
  comments: ProductComment[];
  ratingAverage: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  mediaUrl: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'card' | 'bank_transfer' | 'ussd' | 'mobile_money';
  paymentReference: string;
  status: OrderStatus;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  wishlist: string[]; // product IDs
}

export interface PostComment {
  id: string;
  user: string;
  text: string;
}

export interface Post {
  id: string;
  productId: string;
  caption: string;
  likes: number;
  likedByMe: boolean;
  comments: PostComment[];
  createdAt: number;
  images?: string[];
  videoUrl?: string;
  adminId?: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  avatarBg: string;
  bio: string;
  phone: string;
  whatsapp: string;
}

