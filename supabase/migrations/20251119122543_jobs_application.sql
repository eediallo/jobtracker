CREATE TABLE IF NOT EXISTS jobs (
    -- Primary Key
    id                  SERIAL PRIMARY KEY, -- SERIAL is an auto-incrementing integer (int4)

    -- Foreign Key (assuming a 'users' table exists)
    user_id             UUID NOT NULL,      -- Universal Unique Identifier

    -- Application Details
    position            TEXT,
    company             TEXT,
    city                TEXT,
    application_date    DATE,

    -- Job Post Details
    status              TEXT,
    title               TEXT,
    location            TEXT,
    job_link            TEXT,

    -- Metadata
    created_at          TIMESTAMPTZ,        -- Timestamp with Time Zone (timestamptz)

    -- Optional: Add a foreign key constraint
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users (id) -- Replace 'users' and 'id' if the actual user table/column names differ
);