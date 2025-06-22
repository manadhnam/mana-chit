import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Location {
  id: string;
  name: string;
  type: 'district' | 'mandal' | 'village' | 'branch';
  parentId?: string;
  code: string;
  address?: string;
  contact?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  // Actions
  setLocations: (locations: Location[]) => void;
  addLocation: (location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  setSelectedLocation: (location: Location | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  // Selectors
  getLocationById: (id: string) => Location | undefined;
  getLocationsByType: (type: Location['type']) => Location[];
  getLocationsByParent: (parentId: string) => Location[];
  getLocationHierarchy: () => Record<string, Location[]>;
}

export const useLocationStore = create<LocationState>()(
  devtools(
    persist(
      (set, get) => ({
        locations: [],
        selectedLocation: null,
        isLoading: false,
        error: null,

        setLocations: (locations) => set({ locations }),
        
        addLocation: (location) => {
          const newLocation: Location = {
            ...location,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            locations: [...state.locations, newLocation],
          }));
        },

        updateLocation: (id, location) => {
          set((state) => ({
            locations: state.locations.map((loc) =>
              loc.id === id
                ? { ...loc, ...location, updatedAt: new Date().toISOString() }
                : loc
            ),
          }));
        },

        deleteLocation: (id) => {
          set((state) => ({
            locations: state.locations.filter((loc) => loc.id !== id),
          }));
        },

        setSelectedLocation: (location) => set({ selectedLocation: location }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),

        // Selectors
        getLocationById: (id) => {
          return get().locations.find((loc) => loc.id === id);
        },

        getLocationsByType: (type) => {
          return get().locations.filter((loc) => loc.type === type);
        },

        getLocationsByParent: (parentId) => {
          return get().locations.filter((loc) => loc.parentId === parentId);
        },

        getLocationHierarchy: () => {
          const locations = get().locations;
          return locations.reduce((acc, location) => {
            const type = location.type;
            if (!acc[type]) acc[type] = [];
            acc[type].push(location);
            return acc;
          }, {} as Record<string, Location[]>);
        },
      }),
      {
        name: 'location-storage',
      }
    )
  )
); 