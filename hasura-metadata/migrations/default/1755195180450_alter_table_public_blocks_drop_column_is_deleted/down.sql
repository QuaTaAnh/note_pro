alter table "public"."blocks" alter column "is_deleted" set default false;
alter table "public"."blocks" alter column "is_deleted" drop not null;
alter table "public"."blocks" add column "is_deleted" bool;
