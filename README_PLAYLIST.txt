YOUR OWNSPACE — SUPABASE PLAYLIST BUILD

The nine initial tracks stream from the Supabase Storage public bucket named playlist. No MP3 files are bundled in this ZIP, so the GitHub repository stays small.

Upload index.html, style (2).css, and script (3).js to the same GitHub Pages repository location, preserving the filenames. The player streams the nine tracks from the Supabase URLs configured in script (3).js.

The Add Song control currently adds a selected audio file for the current browser session only; it does not upload it to Supabase or sync it to Raouaa. New shared uploads and cross-device playlist editing still require a secure backend and Storage policies.

The playlist bucket is public, so anyone with the audio URLs can access these files. Only host audio you have permission to distribute.
