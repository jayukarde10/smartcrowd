import { useState, useEffect } from 'react';

export type SavedPlace = {
  id: string;
  label: string;
  address: string;
  icon: 'home' | 'work' | 'college' | 'other';
};

export type RecentSearch = {
  id: string;
  query: string;
  type: 'bus' | 'location';
  timestamp: number;
};

export type PassengerProfile = {
  name: string;
  contact: string;
};

const STORAGE_KEY = 'smartcrowd_passenger_state';

interface PassengerState {
  profile: PassengerProfile;
  savedPlaces: SavedPlace[];
  recentSearches: RecentSearch[];
  notificationsEnabled: boolean;
}

const defaultState: PassengerState = {
  profile: {
    name: 'Passenger',
    contact: 'Not provided',
  },
  savedPlaces: [
    { id: 'home', label: 'Home', address: 'Add your home address', icon: 'home' },
    { id: 'work', label: 'Work', address: 'Add your work address', icon: 'work' },
  ],
  recentSearches: [],
  notificationsEnabled: true,
};

export function usePassengerState() {
  const [state, setState] = useState<PassengerState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateProfile = (profile: PassengerProfile) => {
    setState(s => ({ ...s, profile }));
  };

  const addSavedPlace = (place: Omit<SavedPlace, 'id'>) => {
    const newPlace = { ...place, id: Date.now().toString() };
    setState(s => ({ ...s, savedPlaces: [...s.savedPlaces, newPlace] }));
  };

  const updateSavedPlace = (id: string, updates: Partial<SavedPlace>) => {
    setState(s => ({
      ...s,
      savedPlaces: s.savedPlaces.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const deleteSavedPlace = (id: string) => {
    setState(s => ({
      ...s,
      savedPlaces: s.savedPlaces.filter(p => p.id !== id)
    }));
  };

  const addRecentSearch = (search: Omit<RecentSearch, 'id' | 'timestamp'>) => {
    const newSearch = { ...search, id: Date.now().toString(), timestamp: Date.now() };
    setState(s => {
      // Remove duplicate if same query
      const filtered = s.recentSearches.filter(rs => rs.query !== search.query);
      return {
        ...s,
        // Keep top 10 recent searches
        recentSearches: [newSearch, ...filtered].slice(0, 10)
      };
    });
  };

  const clearRecentSearches = () => {
    setState(s => ({ ...s, recentSearches: [] }));
  };

  const toggleNotifications = () => {
    setState(s => ({ ...s, notificationsEnabled: !s.notificationsEnabled }));
  };

  return {
    ...state,
    updateProfile,
    addSavedPlace,
    updateSavedPlace,
    deleteSavedPlace,
    addRecentSearch,
    clearRecentSearches,
    toggleNotifications,
  };
}
