YOUR OWN SPACE — redesign build

Files:
- index.html
- style (2).css
- script (3).js
- SUPABASE_SETUP.sql

What is included in this build:
- Cream / blush visual redesign layer and responsive navigation.
- Mood Board section.
- Shared playlist add-track UI (currently saved in this browser only).
- Private Space UI with separate code-derived AES-GCM encryption for notes on this device.
- Private Gallery photo preview (not yet persistent or synced).
- Rule R: lowercase r becomes uppercase R in visible text.
- Original content, games and Arcade Station are retained.

Important backend status:
Supabase has NOT been connected yet. The static site cannot securely sync between two devices by itself.
To finish cloud sync, create a Supabase project, run SUPABASE_SETUP.sql, then configure the project URL and anon key in script (3).js and implement authenticated RLS policies. Never put a service_role key in the website.
The current private notes are encrypted locally in this browser; they do not sync to another device. The code is not a substitute for account authentication. Do not use this preview for highly sensitive information.
