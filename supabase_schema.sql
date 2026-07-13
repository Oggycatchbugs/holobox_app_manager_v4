-- HoloBox Manager v11 - safe Supabase setup
-- Chạy file này trong Supabase SQL Editor nếu bảng/bucket chưa tồn tại.
-- Script dùng CREATE IF NOT EXISTS / INSERT ON CONFLICT nên không xóa dữ liệu cũ.

create table if not exists public.holobox_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.holobox_state (id, data, updated_at)
values ('main', '{}'::jsonb, now())
on conflict (id) do nothing;

-- Bucket lưu video/audio. Để public=true nếu app cần dùng public_url để preview/play file.
insert into storage.buckets (id, name, public)
values ('holobox-media', 'holobox-media', true)
on conflict (id) do nothing;
