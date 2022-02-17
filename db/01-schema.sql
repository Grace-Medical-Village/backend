create or replace function update_timestamp() returns trigger
    language plpgsql
as
$$
begin
    if (new != old) then
        new.modified_at = now();
        return new;
    end if;
    return old;
end;
$$;

drop table if exists patient_allergy;
drop table if exists patient_condition;
drop table if exists patient_metric;
drop table if exists patient_medication;
drop table if exists patient_note;
drop table if exists patient;

drop table if exists condition;
drop table if exists metric;
drop table if exists medication;
drop table if exists medication_category;

-- condition --
drop table if exists condition;

create table condition
(
    id             serial primary key,
    condition_name varchar(100) unique     not null,
    created_at     timestamp default now() not null,
    modified_at    timestamp default now() not null
);

create trigger set_timestamp
    before update
    on condition
    for each row
    execute procedure update_timestamp();

-- patient --
drop table if exists patient;

create table patient
(
    id              serial primary key,
    first_name      varchar(50)             not null,
    last_name       varchar(50)             not null,
    birthdate       date                    not null,
    gender          varchar(14),
    email           varchar(100),
    height          smallint,
    mobile          varchar(14),
    map             boolean   default false not null,
    country         varchar(255),
    native_language varchar(100),
    native_literacy smallint,
    smoker          boolean   default false not null,
    zip_code_5      varchar(5),
    archive         boolean   default false not null,
    created_at      timestamp default now() not null,
    modified_at     timestamp default now() not null
);

alter table patient
    add constraint unique_patient unique (first_name, last_name, birthdate);

create trigger set_timestamp
    before update
    on patient
    for each row
    execute procedure update_timestamp();

-- condition --
drop table if exists patient_condition;

create table patient_condition
(
    id           serial primary key,
    condition_id serial references condition (id),
    patient_id   serial references patient (id) on delete cascade,
    created_at   timestamp default now() not null,
    modified_at  timestamp default now() not null
);

alter table patient_condition
    add constraint unique_condition_id unique (condition_id, patient_id);

create trigger set_timestamp
    before update
    on patient_condition
    for each row
    execute procedure update_timestamp();

-- patient_note --
drop table if exists patient_note;

create table patient_note
(
    id          serial primary key,
    note        text,
    patient_id  serial references patient (id) on delete cascade,
    created_at  timestamp default now() not null,
    modified_at timestamp default now() not null
);

create trigger set_timestamp
    before update
    on patient_note
    for each row
    execute procedure update_timestamp();

-- metric --
drop table if exists metric;

create table metric
(
    id              serial primary key,
    metric_name     varchar(50) unique      not null,
    unit_of_measure varchar(50)             not null,
    uom             varchar(10)             not null,
    map             boolean   default false not null,
    min_value       smallint,
    max_value       smallint,
    format          varchar(30),
    pattern         varchar(255),
    archived        boolean   default false not null,
    created_at      timestamp default now() not null,
    modified_at     timestamp default now() not null
);

create trigger set_timestamp
    before update
    on metric
    for each row
    execute procedure update_timestamp();

-- patient_metric --
drop table if exists patient_metric;

create table patient_metric
(
    id          serial primary key,
    patient_id  serial references patient (id) on delete cascade,
    metric_id   serial references metric (id),
    value       varchar(100)               not null,
    comment     varchar(280) default null,
    created_at  timestamp    default now() not null,
    modified_at timestamp    default now() not null
);

create trigger set_timestamp
    before update
    on patient_metric
    for each row
    execute procedure update_timestamp();

-- medication_category --
drop table if exists medication_category;

create table medication_category
(
    id          serial primary key,
    name        varchar(255) unique     not null,
    created_at  timestamp default now() not null,
    modified_at timestamp default now() not null
);

create trigger set_timestamp
    before update
    on medication_category
    for each row
    execute procedure update_timestamp();

-- medication --
drop table if exists medication;

create table medication
(
    id          serial primary key,
    category_id serial references medication_category (id) not null,
    name        varchar(255)                               not null,
    strength    varchar(50),
    archived    boolean   default false                    not null,
    created_at  timestamp default now()                    not null,
    modified_at timestamp default now()                    not null
);

create trigger set_timestamp
    before update
    on medication
    for each row
    execute procedure update_timestamp();

-- patient_medication --
drop table if exists patient_medication;

create table patient_medication
(
    id            serial primary key,
    patient_id    serial references patient (id) on delete cascade,
    medication_id serial references medication (id),
    created_at    timestamp default now() not null,
    modified_at   timestamp default now() not null
);

create trigger set_timestamp
    before update
    on patient_medication
    for each row
    execute procedure update_timestamp();

-- patient_allergy --
drop table if exists patient_allergy;

create table patient_allergy
(
    id          serial primary key,
    patient_id  serial references patient (id) on delete cascade,
    allergy     varchar(500),
    created_at  timestamp default now() not null,
    modified_at timestamp default now() not null
);

create trigger set_timestamp
    before update
    on patient_allergy
    for each row
    execute procedure update_timestamp();
