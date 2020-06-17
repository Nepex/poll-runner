CREATE TABLE poll_runner.public.users
(
    "id" uuid NOT NULL,
    "first_name" character varying(255) NOT NULL,
    "last_name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "password" character varying(255) NOT NULL,
    "is_admin" boolean NOT NULL DEFAULT False,
    PRIMARY KEY ("id")
);

ALTER TABLE poll_runner.public.users
    OWNER to postgres;

CREATE TABLE poll_runner.public.polls
(
    "id" uuid NOT NULL,
    "poll_name" character varying(255) NOT NULL,
    "questions" character varying(255)[] NOT NULL DEFAULT ARRAY[]::character varying[],
    PRIMARY KEY ("id")
);

ALTER TABLE poll_runner.public.polls
    OWNER to postgres;

CREATE TABLE poll_runner.public.active_polls
(
    "id" uuid NOT NULL,
    "poll_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "responses" boolean[] NOT NULL DEFAULT ARRAY[]::boolean[],
    "status" character varying(255) NOT NULL DEFAULT 'not_viewed',
    "last_updated" character varying(255) NOT NULL,
    PRIMARY KEY ("id")
);

ALTER TABLE poll_runner.public.active_polls
    OWNER to postgres;

INSERT INTO users (id, first_name, last_name, email, password, is_admin) VALUES ('845ba708-c7fe-42d6-bae5-74453a67abac', 'Mister', 'Admin', 'admin@example.com', '$2a$10$PB.ibO.j9KI4p5Yc7vx79uiv.IFGBfuPK4in1BW0Zl42O/QUz/pni', true);
