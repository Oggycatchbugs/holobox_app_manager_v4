# HoloBox Manager TLC — v12 Complete Supabase

Bản này dùng lại giao diện v10 đã chốt, nhưng đổi lưu dữ liệu từ `localStorage` sang Supabase.

## Kiến trúc

```text
Frontend
→ Node server trên Render
→ Supabase table: public.holobox_state
→ Supabase Storage bucket: holobox-media
```

App dùng bảng cũ của bạn:

```text
holobox_state
- id text primary key
- data jsonb not null
- updated_at timestamptz not null
```

Dữ liệu app được lưu trong `data jsonb`, gồm locations, devices, videos, audio, playlists, logs, settings.

## File quan trọng

```text
index.html
styles.css
app.js
server.js
package.json
render.yaml
supabase_schema.sql
.env.example
assets/
```

## Chạy local

Cài dependency:

```bash
npm install
```

Windows PowerShell:

```powershell
$env:SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
$env:SUPABASE_STATE_TABLE="holobox_state"
$env:SUPABASE_STATE_ID="main"
$env:SUPABASE_BUCKET="holobox-media"
npm start
```

CMD:

```bat
set SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
set SUPABASE_STATE_TABLE=holobox_state
set SUPABASE_STATE_ID=main
set SUPABASE_BUCKET=holobox-media
npm start
```

Mac/Linux:

```bash
export SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
export SUPABASE_STATE_TABLE="holobox_state"
export SUPABASE_STATE_ID="main"
export SUPABASE_BUCKET="holobox-media"
npm start
```

Mở:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

## Supabase SQL Editor

Nếu bảng `holobox_state` và bucket đã có sẵn thì không bắt buộc chạy SQL.

Nếu thiếu bảng/bucket, mở Supabase → SQL Editor → New query → dán nội dung file:

```text
supabase_schema.sql
```

rồi Run.

Script dùng `CREATE TABLE IF NOT EXISTS` và `ON CONFLICT DO NOTHING`, không drop/xóa dữ liệu cũ.

## Render Environment Variables

Thêm các biến sau trong Render → Service → Environment:

```text
NODE_ENV=production
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_STATE_TABLE=holobox_state
SUPABASE_STATE_ID=main
SUPABASE_BUCKET=holobox-media
UPLOAD_MAX_BYTES=262144000
```

Nếu row cũ trong `holobox_state` không có id là `main`, bạn có 2 lựa chọn:

1. Đặt `SUPABASE_STATE_ID` đúng bằng id row cũ.
2. Bỏ trống `SUPABASE_STATE_ID`, server sẽ tự lấy row mới nhất trong bảng.

## Render deploy config

Build Command:

```bash
npm install
```

Start Command:

```bash
npm start
```

Health Check Path:

```text
/health
```

## GitHub deploy nhanh

```bash
git init
git add .
git commit -m "Deploy HoloBox Manager v11 Supabase"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

Nếu đã có remote origin:

```bash
git remote set-url origin https://github.com/<username>/<repo>.git
git push -u origin main
```

Sau đó vào Render → New → Web Service → chọn repo GitHub → điền build/start/env như trên → Deploy.

## Lưu ý bảo mật

Không đưa `SUPABASE_SERVICE_ROLE_KEY` vào frontend, GitHub, hoặc file public. Key này chỉ đặt trong Render Environment Variables hoặc terminal local.


## v12 fixes

- Added Add HoloBox form in Devices tab.
- Device Open now shows full detail: name, code, status, stream URL, IP/URL, playlist, current video/audio, livestream, HoloBox screen, manifest and device logs.
- Added livestream start/stop so stream does not load by default.
- Added HoloBox Screen tab showing current video/audio and playlist info.
- Audio upload is now aligned with the same upload bar layout as Ads / Videos.
- Added Audio Playlists tab.
- Video Playlists and Audio Playlists now include selectable media items, not just playlist names.
- Playlist edit can update selected video/audio items.
- Settings → Network now includes ping target, ping timeout and a Test Ping action.
- Logo TLC replaced with the user-provided logo style and sharpened for the sidebar.


## Update v12.1 - Video/audio preview fix

- Preview Video now opens a real video player modal instead of only showing a toast.
- Audio preview now opens a real audio player modal.
- Added backend route: `GET /api/media/file/:kind/:id`.
- Playback now redirects through a signed Supabase Storage URL, so it works even if the bucket is private.
- Device HoloBox Screen preview also uses the backend playback URL.
- Added a codec warning: for best browser compatibility use MP4 H.264 video + AAC audio.


## Update v12.2 - Duration and Add HoloBox form fix

- Video/audio duration is now read from the selected file before upload and saved into Supabase state.
- Existing media with `00:00` duration can self-update after opening Preview, when the browser loads metadata.
- The Add HoloBox form now keeps draft values while typing/searching/selecting below it.
- Fixed the issue where typing in the lower search/filter area re-rendered the page and cleared the upper Add HoloBox form.


## Update v12.3 - Deploy cache + Add HoloBox focus fix

- Added cache busting in `index.html`: `styles.css?v=12.3` and `app.js?v=12.3`.
- Server now sends `no-cache, no-store, must-revalidate` for `.html`, `.js`, `.css`.
- Added visible `APP_VERSION = 12.3.0` marker in `app.js` for checking deployed assets.
- Restored/enhanced Add HoloBox form interaction:
  - hover scale
  - focus-within scale
  - subtle border/glow while typing in the form
- Keeps v12.2 fixes:
  - duration read from video/audio metadata before upload
  - Add HoloBox draft values are preserved while search/list below re-renders


## Update v12.4 - Actual logic fix

This version contains the actual logic markers:
- `APP_VERSION = "12.4.0"`
- `duration-metadata-upload`
- `add-device-draft-form`
- `preview-duration-self-heal`

Fixes:
- Upload now reads video/audio metadata in the browser before upload.
- Upload request now sends `duration` and `durationSeconds`.
- Server stores `duration` and `durationSeconds` in Supabase state.
- Preview self-heals old media items that still have `00:00` duration.
- Add HoloBox form values are kept in `state.drafts.addDevice`.
- Search or re-rendering the saved HoloBox list no longer clears the Add HoloBox form.
