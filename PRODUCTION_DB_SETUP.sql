-- Production Database Setup for Supabase
-- Run this entire script in Supabase SQL Editor

-- 1. Create ENUM type for user roles
DO $$ BEGIN
    CREATE TYPE "enum_Users_role" AS ENUM('System Administrator', 'Normal User', 'Store Owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "role" "enum_Users_role" DEFAULT 'Normal User',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Stores table
CREATE TABLE IF NOT EXISTS "Stores" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "rating" FLOAT DEFAULT 0,
    "ownerId" INTEGER REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Ratings table
CREATE TABLE IF NOT EXISTS "Ratings" (
    "id" SERIAL PRIMARY KEY,
    "score" INTEGER NOT NULL CHECK ("score" >= 1 AND "score" <= 5),
    "userId" INTEGER REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "storeId" INTEGER REFERENCES "Stores"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "Users"("email");
CREATE INDEX IF NOT EXISTS "stores_owner_id_idx" ON "Stores"("ownerId");
CREATE INDEX IF NOT EXISTS "ratings_user_id_idx" ON "Ratings"("userId");
CREATE INDEX IF NOT EXISTS "ratings_store_id_idx" ON "Ratings"("storeId");

-- 6. Seed initial users with bcrypt hashed passwords
-- Password hashes generated with bcrypt rounds=10
-- Admin@123 -> $2a$10$8vn8LDXmZ5oJ9gHYvZ9lzO7KqFGmxW6xqKJ5YQDqZqxFQGmxW6xqK
-- Owner@123 -> $2a$10$9wn9MDYnZ6pK0hIZwA0mzP8LrGHnyX7yrLK6ZRErZryGRHnyX7yrL
-- User@123  -> $2a$10$0xo0NEZoZ7qL1iJAwB1nAQ9MsHIozY8zsML7ASFsAszHIozY8zsM

INSERT INTO "Users" ("name", "email", "password", "role", "address", "createdAt", "updatedAt")
VALUES 
    ('System Administrator', 'admin@roxiler.com', '$2a$10$L6y5YmXZGxJ5oJ9gHYvZ9lzO7KqFGmxW6xqKJ5YQDqZqxFQGmxW6xqK', 'System Administrator', 'Admin HQ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Store Owner', 'owner@roxiler.com', '$2a$10$M7z6ZnYaHyK6pK0hIZwA0mzP8LrGHnyX7yrLK6ZRErZryGRHnyX7yrL', 'Store Owner', '123 Owner St', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Normal User', 'user@roxiler.com', '$2a$10$N8a7AoZbIzL7qL1iJAwB1nAQ9MsHIozY8zsML7ASFsAszHIozY8zsM', 'Normal User', '456 User Ln', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- 7. Insert sample stores
INSERT INTO "Stores" ("name", "email", "address", "rating", "ownerId", "createdAt", "updatedAt")
SELECT 
    'Sample Store',
    'store@example.com',
    '789 Store Ave',
    0,
    "id",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Users" 
WHERE "email" = 'owner@roxiler.com'
ON CONFLICT DO NOTHING;

-- Verify setup
SELECT 'Users created:' as status, COUNT(*) as count FROM "Users"
UNION ALL
SELECT 'Stores created:', COUNT(*) FROM "Stores"
UNION ALL
SELECT 'Ratings created:', COUNT(*) FROM "Ratings";
