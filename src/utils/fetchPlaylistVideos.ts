import { supabase } from '../lib/supabase';

export async function fetchPlaylistVideos(playlistId: string, playlistUrl: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('No active session');
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/fetch-playlist`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistUrl: playlistUrl,
        playlistId: playlistId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch playlist videos');
    }

    const data = await response.json();
    console.log(`Fetched ${data.videoCount} videos for playlist ${playlistId}`);
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    throw error;
  }
}

export async function fetchAllPlaylistVideos(): Promise<void> {
  try {
    const { data: playlists } = await supabase
      .from('playlists')
      .select('id, youtube_playlist_url')
      .not('youtube_playlist_url', 'is', null);

    if (!playlists) return;

    for (const playlist of playlists) {
      if (playlist.youtube_playlist_url) {
        await fetchPlaylistVideos(playlist.id, playlist.youtube_playlist_url);
      }
    }
  } catch (error) {
    console.error('Error fetching all playlist videos:', error);
    throw error;
  }
}
