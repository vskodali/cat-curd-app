CREATE USER myuser WITH PASSWORD 'mypassword';
CREATE DATABASE cat_collector;
GRANT ALL PRIVILEGES ON DATABASE cat_collector TO myuser;
DROP DATABASE cat_collector;