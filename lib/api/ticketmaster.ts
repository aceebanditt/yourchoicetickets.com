import { cache } from 'react';

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = 'qjDvJ4CzUp4N4TWaHiEen8DiXEt4uLEA';

// Cache the fetch requests for 5 minutes
const CACHE_TIME = 5 * 60 * 1000;

export type Event = {
  id: string;
  name: string;
  url: string;
  dates: {
    start: {
      dateTime: string;
      localDate: string;
      localTime: string;
    };
  };
  images: Array<{
    url: string;
    ratio: string;
    width: number;
    height: number;
  }>;
  priceRanges?: Array<{
    type: string;
    currency: string;
    min: number;
    max: number;
  }>;
  _embedded?: {
    venues: Array<{
      id: string;
      name: string;
      city: {
        name: string;
      };
      state: {
        name: string;
      };
      country: {
        name: string;
      };
      address: {
        line1: string;
      };
      location: {
        latitude: string;
        longitude: string;
      };
    }>;
  };
  classifications?: Array<{
    segment: {
      id: string;
      name: string;
    };
    genre: {
      id: string;
      name: string;
    };
    subGenre: {
      id: string;
      name: string;
    };
  }>;
};

export const searchEvents = cache(async (params: {
  keyword?: string;
  classificationName?: string;
  city?: string;
  stateCode?: string;
  startDateTime?: string;
  endDateTime?: string;
  size?: number;
  page?: number;
  sort?: string;
}) => {
  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    locale: '*',
    ...params,
  });

  const response = await fetch(`${BASE_URL}/events.json?${searchParams}`, {
    next: { revalidate: CACHE_TIME },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
});

export const getEventDetails = cache(async (id: string) => {
  const response = await fetch(
    `${BASE_URL}/events/${id}.json?apikey=${API_KEY}&locale=*`,
    {
      next: { revalidate: CACHE_TIME },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch event details');
  }

  return response.json();
});

export const getCategories = cache(async () => {
  const response = await fetch(
    `${BASE_URL}/classifications.json?apikey=${API_KEY}&locale=*`,
    {
      next: { revalidate: CACHE_TIME },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
});

export const searchVenues = cache(async (params: {
  keyword?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
}) => {
  const searchParams = new URLSearchParams({
    apikey: API_KEY,
    locale: '*',
    ...params,
  });

  const response = await fetch(
    `${BASE_URL}/venues.json?${searchParams}`,
    {
      next: { revalidate: CACHE_TIME },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }

  return response.json();
});

export const getSuggestions = cache(async (keyword: string) => {
  const response = await fetch(
    `${BASE_URL}/suggest.json?apikey=${API_KEY}&keyword=${encodeURIComponent(keyword)}`,
    {
      next: { revalidate: CACHE_TIME },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }

  return response.json();
});