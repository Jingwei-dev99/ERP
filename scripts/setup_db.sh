#!/bin/bash

# Create database if it doesn't exist
psql -c "CREATE DATABASE case1;" 2>/dev/null || echo "Database already exists"

# Run migrations
psql -d case1 -f server/src/models/migrations/001_create_users_tables.sql
psql -d case1 -f server/src/models/migrations/002_create_finance_tables.sql
psql -d case1 -f server/src/models/migrations/003_create_customer_tables.sql

# Seed test user
psql -d case1 -f server/src/models/migrations/seed_test_user.sql

echo "Database setup completed!" 