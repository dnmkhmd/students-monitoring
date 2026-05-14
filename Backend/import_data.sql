-- SQL script to create students_information table and import data from CSV

-- 1. Create table (if not exists)
CREATE TABLE IF NOT EXISTS students_information (
    id SERIAL PRIMARY KEY,
    op TEXT,
    full_name TEXT,
    iin VARCHAR(20),
    grant_contract TEXT,
    category TEXT,
    bin VARCHAR(20),
    enterprise_spec TEXT,
    enterprise_non_spec TEXT,
    position TEXT,
    city_region TEXT,
    continued_edu TEXT,
    released TEXT,
    document TEXT
);

-- 2. Import data from CSV
-- Note: Replace the path below with the absolute path to your CSV file if running on a different machine.
-- This command assumes the CSV header matches the column names.
COPY students_information(id, op, full_name, iin, grant_contract, category, bin, enterprise_spec, enterprise_non_spec, position, city_region, continued_edu, released, document)
FROM '/Users/dimash/Desktop/folders/dp/Kazbek/students-monitoring/Data/data-1773310485125.csv'
DELIMITER ','
CSV HEADER;

-- 3. Reset the ID sequence if needed (since we imported IDs manually)
SELECT setval(pg_get_serial_sequence('students_information', 'id'), coalesce(max(id), 1)) FROM students_information;
