-- patient --
insert into patient (first_name, last_name, birthdate, gender, email, mobile, country, native_language, native_literacy,
                     zip_code_5)
values ('Mohammed', 'bin Salman', '1983-11-03', 'male', 'mo@gmail.com', '5551234567', 'Saudi Arabia', 'arabic', 4,
        '12345'),
       ('John', 'Doe', '2000-01-01', 'male', 'johndoe@gmail.com', '5551234567', 'United States', 'english', 3, '12345'),
       ('Jane', 'Smith', '1970-12-15', 'female', 'jane@example.com', '5551234567', 'United States', 'english', 5,
        '12345');
insert into patient (first_name, last_name, gender, birthdate)
values ('Betty', 'White', 'female', '1922-01-17');

-- patient_condition --
insert into patient_condition (condition_id, patient_id)
values ((select id from condition order by random() limit 1), (select id from patient order by random() limit 1)),
       ((select id from condition order by random() limit 1), (select id from patient order by random() limit 1)),
       ((select id from condition order by random() limit 1), (select id from patient order by random() limit 1)),
       ((select id from condition order by random() limit 1), (select id from patient order by random() limit 1));

-- patient_medication --
insert into patient_medication (patient_id, medication_id)
values ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1)),
       ((select id from patient order by random() limit 1), (select id from medication order by random() limit 1));


-- patient_metric --
insert into patient_metric (patient_id, metric_id, value)
values ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int)),
       ((select id from patient order by random() limit 1), (select id from metric order by random() limit 1),
        (SELECT floor(random() * 10 + 1)::int));

-- patient_note --
insert into patient_note (patient_id, note)
values ((select id from patient order by random() limit 1),
        'Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Etiam vitae blandit massa. Nam in nunc nisi. Nulla vitae sapien in augue pharetra vestibulum. Nullam lobortis neque vel tellus ornare tempor. Sed dignissim neque erat,
        nec sollicitudin neque posuere eu. Vestibulum leo nulla, euismod non accumsan nec, gravida non purus. Fusce maximus non tortor et condimentum. Vivamus varius risus a velit cursus volutpat.'),
       ((select id from patient order by random() limit 1),
        ' Proin sit amet elit sit amet felis ultricies rhoncus a a felis. Nam ultrices luctus pharetra. Quisque ullamcorper accumsan dictum. Etiam ut leo nisi. Aenean ut augue id ipsum vestibulum sodales. Quisque molestie vel enim non porttitor. Vivamus nec augue rutrum,
        imperdiet magna eu, fermentum eros.'),
       ((select id from patient order by random() limit 1), 'Fusce ut convallis tortor.'),
       ((select id from patient order by random() limit 1),
        'Duis ex nulla, interdum nec enim et, vestibulum fermentum justo. Maecenas fringilla.'),
       ((select id from patient order by random() limit 1),
        'Nullam ullamcorper, massa et facilisis auctor, risus eros consectetur diam,
        eget mollis libero enim at tellus. Quisque elementum quam a metus faucibus,
        at interdum metus fringilla. Etiam ipsum diam, volutpat a quam in,
        ultricies lacinia justo. Nulla congue posuere porta. Etiam ullamcorper odio eros. Phasellus egestas urna in nulla imperdiet feugiat. Sed vel augue ultrices,
        convallis velit quis,
        feugiat turpis. Pellentesque eu viverra neque. Vestibulum consectetur arcu a accumsan auctor. Nam ultrices enim ante,
        ac finibus metus sodales ac. Nam nec turpis ut augue imperdiet iaculis sed quis augue. Phasellus rutrum ac tellus ac cursus. Nulla ac posuere diam. In facilisis tempus leo,
        vel pellentesque erat scelerisque non.'),
       ((select id from patient order by random() limit 1), 'Proin in tempus dolor. In vitae sollicitudin est.')
        ,
       ((select id
         from patient
         order by random()
         limit 1),
        'Vestibulum suscipit nisl cursus vestibulum mattis. Proin quis gravida sapien, sit amet semper nunc.');
