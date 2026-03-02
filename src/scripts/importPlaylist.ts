import { supabase } from '../lib/supabase';

const PLAYLIST_URL = 'https://www.youtube.com/watch?v=uuZZTx2HtHo&list=PLxYDMSdfTAgQ68xi_bm7AkkE7e6x9y9lC';
const PLAYLIST_ID = 'PLxYDMSdfTAgQ68xi_bm7AkkE7e6x9y9lC';
const LOOP_ID = '6dc98197-8ed0-477e-95ec-3413045cdf8e';
const CREATOR_ID = '1c824f60-0192-46ba-8687-15841409a7e5';

async function importPlaylist() {
  try {
    const { data: existingPlaylist } = await supabase
      .from('playlists')
      .select('id')
      .eq('youtube_playlist_id', PLAYLIST_ID)
      .maybeSingle();

    let playlistDbId: string;

    if (existingPlaylist) {
      playlistDbId = existingPlaylist.id;
      console.log('Playlist already exists:', playlistDbId);
    } else {
      const { data: newPlaylist, error: insertError } = await supabase
        .from('playlists')
        .insert({
          creator_profile_id: CREATOR_ID,
          title: 'Philosophy Playlist',
          youtube_playlist_url: PLAYLIST_URL,
          youtube_playlist_id: PLAYLIST_ID,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      playlistDbId = newPlaylist.id;
      console.log('Created new playlist:', playlistDbId);

      const { data: loopPlaylists } = await supabase
        .from('loop_playlists')
        .select('order_index')
        .eq('loop_id', LOOP_ID)
        .order('order_index', { ascending: false })
        .limit(1);

      const nextOrderIndex = loopPlaylists && loopPlaylists.length > 0 ? loopPlaylists[0].order_index + 1 : 0;

      await supabase.from('loop_playlists').insert({
        loop_id: LOOP_ID,
        playlist_id: playlistDbId,
        order_index: nextOrderIndex,
      });

      console.log('Added playlist to loop');
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error('No active session. Please log in first.');
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/fetch-playlist`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistUrl: PLAYLIST_URL,
        playlistId: playlistDbId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist videos: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.videoCount} videos`);
  } catch (error) {
    console.error('Error importing playlist:', error);
  }
}

export default importPlaylist;
