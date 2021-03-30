CREATE SEQUENCE IF NOT EXISTS tenant_id_seq;
CREATE TABLE IF NOT EXISTS public.tenant
(
    id integer NOT NULL DEFAULT nextval('tenant_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    email text UNIQUE COLLATE pg_catalog."default" NOT NULL,
    company_name text COLLATE pg_catalog."default" NOT NULL,
    mobile numeric(10,0) NOT NULL,
    country text COLLATE pg_catalog."default" NOT NULL,
    language text COLLATE pg_catalog."default" NOT NULL,
    company_size text COLLATE pg_catalog."default" NOT NULL,
    primary_interest text COLLATE pg_catalog."default" NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_DATE,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    updated_at DATE NULL,
    updated_by text COLLATE pg_catalog."default" NULL,
    "isEmailValidated" BOOLEAN NULL DEFAULT False,
    "isActive" BOOLEAN DEFAULT True,
    "isDeleted" BOOLEAN DEFAULT False,
    CONSTRAINT tenant_pkey PRIMARY KEY (id)
)

CREATE SEQUENCE IF NOT EXISTS users_id_seq;
CREATE TABLE IF NOT EXISTS public."users"
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    first_name text COLLATE pg_catalog."default" NOT NULL,
    last_name text COLLATE pg_catalog."default" NOT NULL,
    address text COLLATE pg_catalog."default" NOT NULL,
    username text UNIQUE COLLATE pg_catalog."default" NOT NULL,
    encrypted_password text COLLATE pg_catalog."default",
    temp_password text COLLATE pg_catalog."default",
    isreset_password boolean NOT NULL DEFAULT false,
    mobile  NUMERIC(10, 0)  NOT NULL UNIQUE,
    ismobile_verified boolean NOT NULL DEFAULT true,
    email text UNIQUE COLLATE pg_catalog."default" NOT NULL,
    isemail_verified boolean NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_DATE NOT NULL,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    updated_at TIMESTAMP,
    updated_by text COLLATE pg_catalog."default",
    is_active boolean NOT NULL DEFAULT true,
    is_deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)


INSERT INTO USERS
(
   first_name,
   last_name,
   address,
   username,
   encrypted_password,
   mobile,
   email,
   isemail_verified,
   created_by,
   created_at  
)
VALUES
(
   'Anurag',
   'Hasoriya',
   'Maharashtra',
   'admin',
   'mrFTyNDyZSAMGDzvwfgXl73GMeHySR9m2KPDNan+aNc=',
   7020782854,
   'anurag.hasoriya@xcdify.com',
   True,
   'admin',
   CURRENT_DATE
)

CREATE SEQUENCE IF NOT EXISTS membership_plan_id_seq;
CREATE TABLE IF NOT EXISTS public.membership_plan
(
    id integer NOT NULL DEFAULT nextval('membership_plan_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    price real NOT NULL,
    project_limit integer NOT NULL,
    user_limit integer NOT NULL,
    plan_duration text COLLATE pg_catalog."default" NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_DATE,
    created_by character varying(50) COLLATE pg_catalog."default" NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_DATE,
    updated_by character varying(50) COLLATE pg_catalog."default" NULL,
    is_active boolean NOT NULL DEFAULT TRUE,
    is_deleted boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT membership_plan_pkey PRIMARY KEY (id)
) 

CREATE SEQUENCE IF NOT EXISTS tenant_subscription_id_seq;
CREATE TYPE status_type AS ENUM('Active', 'Inactive', 'Suspended');
CREATE TABLE IF NOT EXISTS public."tenant_subscription"
(
    id integer NOT NULL DEFAULT nextval('tenant_subscription_id_seq'::regclass),
    tenant_id integer NOT NULL,
    membership_plan_id integer NOT NULL ,
    effective_from date NOT NULL DEFAULT CURRENT_DATE,
    effective_to date NOT NULL,
    auto_renew boolean NOT NULL DEFAULT TRUE,
    status status_type NOT NULL DEFAULT 'Active',
    created_at date NOT NULL,
    created_by character varying(50) COLLATE pg_catalog."default" NOT NULL,
    updated_at date NULL DEFAULT CURRENT_DATE,
    updated_by character varying(50) COLLATE pg_catalog."default" NULL,
    is_active boolean NOT NULL DEFAULT TRUE,
    is_deleted boolean NOT NULL DEFAULT FALSE,
    CONSTRAINT "tenant_subscription_pkey" PRIMARY KEY (id),
    FOREIGN Key (tenant_id) REFERENCES tenant (id),
	FOREIGN KEY (membership_plan_id) REFERENCES membership_plan (id)
)

