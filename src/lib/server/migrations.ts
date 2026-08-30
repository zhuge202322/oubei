import type { DatabaseConnection } from "@/lib/server/db";

const migrations = [
  `
    create table if not exists schema_migrations (
      version integer primary key,
      applied_at text not null
    );

    create table if not exists admin_users (
      id integer primary key autoincrement,
      username text not null unique,
      password_hash text not null,
      created_at text not null,
      updated_at text not null
    );

    create table if not exists admin_sessions (
      id integer primary key autoincrement,
      user_id integer not null references admin_users(id) on delete cascade,
      token_hash text not null unique,
      created_at text not null,
      expires_at text not null,
      revoked_at text
    );

    create table if not exists site_settings (
      key text primary key,
      value text not null,
      updated_at text not null
    );

    create table if not exists categories (
      id integer primary key autoincrement,
      name text not null,
      slug text not null unique,
      description text not null default '',
      sort_order integer not null default 0,
      is_active integer not null default 1 check (is_active in (0, 1)),
      created_at text not null,
      updated_at text not null
    );

    create table if not exists products (
      id integer primary key autoincrement,
      slug text not null unique,
      name text not null,
      code text not null,
      category_id integer references categories(id) on delete restrict,
      short_description text not null default '',
      description text not null default '',
      material text not null default '',
      applications_json text not null default '[]',
      specs_json text not null default '[]',
      image_default_path text,
      is_active integer not null default 1 check (is_active in (0, 1)),
      created_at text not null,
      updated_at text not null
    );

    create table if not exists media_files (
      id integer primary key autoincrement,
      storage_name text not null unique,
      original_name text not null,
      mime_type text not null,
      size_bytes integer not null,
      relative_path text not null unique,
      created_at text not null
    );

    create table if not exists product_images (
      id integer primary key autoincrement,
      product_id integer not null references products(id) on delete cascade,
      media_file_id integer references media_files(id) on delete set null,
      default_path text,
      alt text not null default '',
      sort_order integer not null default 0
    );

    create table if not exists media_slots (
      id integer primary key autoincrement,
      slot_key text not null unique,
      page_key text not null,
      label text not null,
      alt text not null default '',
      default_path text not null,
      media_file_id integer references media_files(id) on delete set null,
      updated_at text not null
    );

    create index if not exists idx_products_category on products(category_id);
    create index if not exists idx_product_images_product on product_images(product_id, sort_order);
    create index if not exists idx_media_slots_page on media_slots(page_key);
    create index if not exists idx_sessions_token on admin_sessions(token_hash);
  `,
] as const;

export function migrateDatabase(db: DatabaseConnection) {
  db.exec("create table if not exists schema_migrations (version integer primary key, applied_at text not null)");
  const applied = new Set(
    db.prepare("select version from schema_migrations order by version").all().map((row) => (row as { version: number }).version),
  );

  for (let index = 0; index < migrations.length; index += 1) {
    const version = index + 1;
    if (applied.has(version)) continue;
    const migration = migrations[index];
    const apply = db.transaction(() => {
      db.exec(migration);
      db.prepare("insert into schema_migrations (version, applied_at) values (?, ?)").run(version, new Date().toISOString());
    });
    apply();
  }
}
