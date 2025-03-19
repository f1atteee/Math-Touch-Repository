CREATE EXTENSION IF NOT EXISTS postgres_fdw;

CREATE SERVER identity_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host 'localhost', dbname 'IdentityUsers', port '5432');

CREATE USER MAPPING FOR CURRENT_USER
SERVER identity_server
OPTIONS (user 'postgres', password '123123');

DROP FOREIGN TABLE IF EXISTS identity_users_users;

CREATE FOREIGN TABLE identity_users_users (
    "Id" UUID,  -- Використовуйте лапки для чутливих до регістру імен
    "Phone" TEXT
)
SERVER identity_server
OPTIONS (table_name 'Users');


CREATE OR REPLACE FUNCTION update_identity_id()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public."Users" AS t
    SET "IdentityId" = i."Id" -- Правильне написання Id
    FROM identity_users_users AS i
    WHERE t."Phone" = i."Phone"  -- Використовуйте правильну назву стовпця
    AND t."Id" = NEW."Id";  -- Використовуйте правильну назву стовпця
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER after_insert_update_identity_id
AFTER INSERT OR UPDATE ON public."Users"
FOR EACH ROW
EXECUTE FUNCTION update_identity_id();






