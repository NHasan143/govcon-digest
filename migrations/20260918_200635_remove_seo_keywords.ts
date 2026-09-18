import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`posts_texts\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_texts\`;`)
  await db.run(sql`DROP TABLE \`news_texts\`;`)
  await db.run(sql`DROP TABLE \`_news_v_texts\`;`)
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`seo_focus_keyword\`;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_seo_focus_keyword\`;`)
  await db.run(sql`ALTER TABLE \`news\` DROP COLUMN \`seo_focus_keyword\`;`)
  await db.run(sql`ALTER TABLE \`_news_v\` DROP COLUMN \`version_seo_focus_keyword\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`posts_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_texts_order_parent\` ON \`posts_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_texts_order_parent\` ON \`_posts_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_texts_order_parent\` ON \`news_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_texts_order_parent\` ON \`_news_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`seo_focus_keyword\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_seo_focus_keyword\` text;`)
  await db.run(sql`ALTER TABLE \`news\` ADD \`seo_focus_keyword\` text;`)
  await db.run(sql`ALTER TABLE \`_news_v\` ADD \`version_seo_focus_keyword\` text;`)
}
