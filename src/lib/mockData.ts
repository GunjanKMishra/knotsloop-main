// Mock data for frontend-only app
export interface Discipline {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
  views: number;
}

export interface Loop {
  id: string;
  name: string;
  description: string;
  discipline_id: string;
  videos: Video[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
  updated_at: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  loops: string[]; // loop IDs
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'user';
  created_at: string;
  playlists: string[]; // playlist IDs
  saved_loops: string[]; // loop IDs
}

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// Mock Disciplines
const mockDisciplines: Discipline[] = [
  {
    id: 'discipline-1',
    name: 'Meditation',
    icon: '🧘',
    color: '#8B5CF6',
    description: 'Mindfulness and meditation practices'
  },
  {
    id: 'discipline-2',
    name: 'Fitness',
    icon: '💪',
    color: '#EC4899',
    description: 'Physical exercise and strength training'
  },
  {
    id: 'discipline-3',
    name: 'Learning',
    icon: '📚',
    color: '#3B82F6',
    description: 'Educational content and skill development'
  },
  {
    id: 'discipline-4',
    name: 'Creativity',
    icon: '🎨',
    color: '#F59E0B',
    description: 'Creative arts and expression'
  }
];

// Mock Videos
const mockVideos: Video[] = [
  {
    id: 'video-1',
    title: 'Intro to Meditation',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
    duration: 300,
    views: 1250
  },
  {
    id: 'video-2',
    title: 'Morning Yoga Flow',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
    duration: 900,
    views: 3450
  },
  {
    id: 'video-3',
    title: 'Breathing Exercises',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
    duration: 600,
    views: 890
  },
  {
    id: 'video-4',
    title: 'HIIT Workout',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
    duration: 1200,
    views: 5600
  },
  {
    id: 'video-5',
    title: 'Strength Training Basics',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
    duration: 1500,
    views: 4200
  }
];

// Mock Loops
const mockLoops: Loop[] = [
  {
    id: 'loop-1',
    name: 'Daily Meditation Practice',
    description: 'A beginner-friendly meditation routine for daily practice',
    discipline_id: 'discipline-1',
    videos: [mockVideos[0], mockVideos[2]],
    duration: 900,
    difficulty: 'beginner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'loop-2',
    name: 'Morning Fitness Routine',
    description: 'Start your day with an energizing fitness routine',
    discipline_id: 'discipline-2',
    videos: [mockVideos[1], mockVideos[3]],
    duration: 2100,
    difficulty: 'intermediate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'loop-3',
    name: 'Strength Training Series',
    description: 'Complete strength training program for beginners',
    discipline_id: 'discipline-2',
    videos: [mockVideos[4]],
    duration: 1500,
    difficulty: 'beginner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'loop-4',
    name: 'Advanced Meditation',
    description: 'Deep meditation techniques for experienced practitioners',
    discipline_id: 'discipline-1',
    videos: [mockVideos[0], mockVideos[2]],
    duration: 1800,
    difficulty: 'advanced',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Mock Playlists
const mockPlaylists: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'My Wellness Journey',
    description: 'Personal collection of wellness loops',
    loops: ['loop-1', 'loop-2'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1'
  },
  {
    id: 'playlist-2',
    name: 'Fitness Challenge',
    description: 'Daily fitness routines for the challenge',
    loops: ['loop-2', 'loop-3'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1'
  }
];

// Mock Users
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user',
    created_at: new Date().toISOString(),
    playlists: ['playlist-1', 'playlist-2'],
    saved_loops: ['loop-1', 'loop-2', 'loop-3']
  },
  {
    id: 'user-2',
    email: 'creator@example.com',
    name: 'Jane Smith',
    role: 'creator',
    created_at: new Date().toISOString(),
    playlists: [],
    saved_loops: []
  }
];

// Mock Waitlist
const mockWaitlist: WaitlistEntry[] = [];

// Initialize from localStorage or use defaults
function getInitialData() {
  if (typeof window === 'undefined') {
    return {
      disciplines: mockDisciplines,
      videos: mockVideos,
      loops: mockLoops,
      playlists: mockPlaylists,
      users: mockUsers,
      waitlist: mockWaitlist
    };
  }

  try {
    const stored = localStorage.getItem('knotsloop_data');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading data from localStorage', e);
  }

  return {
    disciplines: mockDisciplines,
    videos: mockVideos,
    loops: mockLoops,
    playlists: mockPlaylists,
    users: mockUsers,
    waitlist: mockWaitlist
  };
}

// Data store
let dataStore = getInitialData();

// Persist to localStorage
function persistData() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('knotsloop_data', JSON.stringify(dataStore));
  }
}

// Discipline methods
export const disciplines = {
  async getAll() {
    return dataStore.disciplines;
  },
  async getById(id: string) {
    return dataStore.disciplines.find(d => d.id === id);
  }
};

// Video methods
export const videos = {
  async getAll() {
    return dataStore.videos;
  },
  async getById(id: string) {
    return dataStore.videos.find(v => v.id === id);
  },
  async create(video: Omit<Video, 'id'>) {
    const newVideo: Video = {
      ...video,
      id: `video-${Date.now()}`
    };
    dataStore.videos.push(newVideo);
    persistData();
    return newVideo;
  },
  async update(id: string, updates: Partial<Video>) {
    const index = dataStore.videos.findIndex(v => v.id === id);
    if (index !== -1) {
      dataStore.videos[index] = { ...dataStore.videos[index], ...updates };
      persistData();
      return dataStore.videos[index];
    }
    return null;
  },
  async delete(id: string) {
    dataStore.videos = dataStore.videos.filter(v => v.id !== id);
    persistData();
    return true;
  }
};

// Loop methods
export const loops = {
  async getAll() {
    return dataStore.loops;
  },
  async getById(id: string) {
    return dataStore.loops.find(l => l.id === id);
  },
  async getByDiscipline(disciplineId: string) {
    return dataStore.loops.filter(l => l.discipline_id === disciplineId);
  },
  async create(loop: Omit<Loop, 'id' | 'created_at' | 'updated_at'>) {
    const newLoop: Loop = {
      ...loop,
      id: `loop-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    dataStore.loops.push(newLoop);
    persistData();
    return newLoop;
  },
  async update(id: string, updates: Partial<Loop>) {
    const index = dataStore.loops.findIndex(l => l.id === id);
    if (index !== -1) {
      dataStore.loops[index] = {
        ...dataStore.loops[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      persistData();
      return dataStore.loops[index];
    }
    return null;
  },
  async delete(id: string) {
    dataStore.loops = dataStore.loops.filter(l => l.id !== id);
    persistData();
    return true;
  }
};

// Playlist methods
export const playlists = {
  async getAll() {
    return dataStore.playlists;
  },
  async getById(id: string) {
    return dataStore.playlists.find(p => p.id === id);
  },
  async getByUserId(userId: string) {
    return dataStore.playlists.filter(p => p.user_id === userId);
  },
  async create(playlist: Omit<Playlist, 'id' | 'created_at' | 'updated_at'>) {
    const newPlaylist: Playlist = {
      ...playlist,
      id: `playlist-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    dataStore.playlists.push(newPlaylist);
    persistData();
    return newPlaylist;
  },
  async update(id: string, updates: Partial<Playlist>) {
    const index = dataStore.playlists.findIndex(p => p.id === id);
    if (index !== -1) {
      dataStore.playlists[index] = {
        ...dataStore.playlists[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      persistData();
      return dataStore.playlists[index];
    }
    return null;
  },
  async delete(id: string) {
    dataStore.playlists = dataStore.playlists.filter(p => p.id !== id);
    persistData();
    return true;
  }
};

// User methods
export const users = {
  async getAll() {
    return dataStore.users;
  },
  async getById(id: string) {
    return dataStore.users.find(u => u.id === id);
  },
  async getByEmail(email: string) {
    return dataStore.users.find(u => u.email === email);
  },
  async create(user: Omit<User, 'id' | 'created_at'>) {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    dataStore.users.push(newUser);
    persistData();
    return newUser;
  },
  async update(id: string, updates: Partial<User>) {
    const index = dataStore.users.findIndex(u => u.id === id);
    if (index !== -1) {
      dataStore.users[index] = { ...dataStore.users[index], ...updates };
      persistData();
      return dataStore.users[index];
    }
    return null;
  },
  async delete(id: string) {
    dataStore.users = dataStore.users.filter(u => u.id !== id);
    persistData();
    return true;
  }
};

// Waitlist methods
export const waitlist = {
  async getAll() {
    return dataStore.waitlist;
  },
  async create(entry: Omit<WaitlistEntry, 'id' | 'created_at'>) {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `waitlist-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    dataStore.waitlist.push(newEntry);
    persistData();
    return newEntry;
  }
};

// Auth mock
export const auth = {
  async signUp(email: string, password: string, name: string) {
    const existingUser = await users.getByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const newUser = await users.create({
      email,
      name,
      role: 'user',
      playlists: [],
      saved_loops: []
    });
    localStorage.setItem('knotsloop_auth', JSON.stringify({ userId: newUser.id, email }));
    return newUser;
  },
  async signIn(email: string, password: string) {
    const user = await users.getByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    localStorage.setItem('knotsloop_auth', JSON.stringify({ userId: user.id, email }));
    return user;
  },
  async signOut() {
    localStorage.removeItem('knotsloop_auth');
  },
  async getCurrentUser() {
    try {
      const auth = localStorage.getItem('knotsloop_auth');
      if (auth) {
        const { userId } = JSON.parse(auth);
        return await users.getById(userId);
      }
    } catch (e) {
      console.error('Error getting current user', e);
    }
    return null;
  }
};

export default {
  disciplines,
  videos,
  loops,
  playlists,
  users,
  waitlist,
  auth
};
