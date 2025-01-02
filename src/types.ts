export type Comment = {
  id: string;
  date: string;
  user: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  comment: string;
  rating: number;
};


export type User = {
    name: string;
    avatarUrl: string;
    isPro: boolean;
    email: string;
    token: string;
  };

export type Offer = {
    id: string;
    title: string;
    type: string;
    price: number;
    city: {
      name: string;
      location: {
        latitude: number;
        longitude: number;
        zoom: number;
      };
    };
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
    isFavorite: boolean;
    isPremium: boolean;
    rating: number;

    previewImage?: string;

    description?: string;
    bedrooms?: number;
    goods?: string[];
    host?: {
      name: string;
      avatarUrl: string;
      isPro: boolean;
    };
    images?: string[];
    maxAdults?: number;
  };


