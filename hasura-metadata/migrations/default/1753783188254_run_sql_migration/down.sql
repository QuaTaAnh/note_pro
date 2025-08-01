-- Drop dependent tables first
DROP TABLE IF EXISTS block_tags CASCADE;
DROP TABLE IF EXISTS block_links CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS files CASCADE;

DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS folders CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS users CASCADE;