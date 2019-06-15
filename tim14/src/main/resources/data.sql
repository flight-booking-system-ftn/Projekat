INSERT INTO `authorities` values (1, "ROLE_REGISTEREDUSER");
INSERT INTO `authorities` values (2, "ROLE_AIRLINEADMIN");
INSERT INTO `authorities` values (3, "ROLE_HOTELADMIN");
INSERT INTO `authorities` values (4, "ROLE_RENTACARADMIN");
INSERT INTO `authorities` values (5, "ROLE_SYSTEMADMIN");

INSERT INTO `destination` VALUES (1,'Ulica 1','Serbia', 44.7866, 20.4489, 'Belgrade'); 
INSERT INTO `destination` VALUES (2,'Ulica 2','Serbia', 44.7933, 20.4449, 'Belgrade'); 
INSERT INTO `destination` VALUES (3,'Ulica 3','Serbia', 44.7333, 20.4499, 'Belgrade'); 
INSERT INTO `destination` VALUES (4,'Ulica 4','Serbia', 44.7535, 20.4488, 'Belgrade'); 
INSERT INTO `destination` VALUES (5,'Ulica 5','Serbia', 44.7835, 20.4477, 'Belgrade'); 
INSERT INTO `destination` VALUES (6,'Ulica 6','Serbia', 44.7855, 20.4466, 'Belgrade'); 
INSERT INTO `destination` VALUES (7,'Ulica 7','Serbia', 44.7866, 20.4455, 'Belgrade'); 
INSERT INTO `destination` VALUES (8,'Ulica 8','Serbia', 44.7877, 20.4444, 'Belgrade'); 
INSERT INTO `destination` VALUES (9,'Ulica 9','Serbia', 44.7888, 20.4433, 'Belgrade'); 
INSERT INTO `destination` VALUES (10,'Ulica 10','Serbia', 44.7899, 20.4422, 'Belgrade'); 
INSERT INTO `destination` VALUES (11,'Street 1','United Kingdom', 51.501, 0.1278, 'London'); 
INSERT INTO `destination` VALUES (12,'Street 2','United Kingdom', 51.533, 0.1378, 'London'); 
INSERT INTO `destination` VALUES (13,'Street 3','United Kingdom', 51.544, 0.1478, 'London'); 
INSERT INTO `destination` VALUES (14,'Street 4','United Kingdom', 51.551, 0.1578, 'London'); 
INSERT INTO `destination` VALUES (15,'Street 5','United Kingdom', 51.511, 0.1678, 'London'); 
INSERT INTO `destination` VALUES (16,'Street 6','United Kingdom', 51.531, 0.1778, 'London'); 
INSERT INTO `destination` VALUES (17,'Street 7','United Kingdom', 51.521, 0.1868, 'London'); 
INSERT INTO `destination` VALUES (18,'Rue 1','France', 48.8500, 2.3556, 'Paris'); 
INSERT INTO `destination` VALUES (19,'Rue 2','France', 48.8512, 2.3545, 'Paris'); 
INSERT INTO `destination` VALUES (20,'Rue 3','France', 48.8534, 2.3534, 'Paris'); 
INSERT INTO `destination` VALUES (21,'Rue 4','France', 48.8545, 2.3521, 'Paris'); 
INSERT INTO `destination` VALUES (22,'Rue 5','France', 48.8577, 2.3511, 'Paris'); 
INSERT INTO `destination` VALUES (23,'Strase 1','Germany', 50.1003, 8.7051, 'Frankfurt'); 
INSERT INTO `destination` VALUES (24,'Strase 2','Germany', 50.1053, 8.7041, 'Frankfurt'); 
INSERT INTO `destination` VALUES (25,'Strase 3','Germany', 50.1063, 8.7031, 'Frankfurt'); 
INSERT INTO `destination` VALUES (26,'Strase 4','Germany', 50.1073, 8.7021, 'Frankfurt'); 
INSERT INTO `destination` VALUES (27,'Strase 5','Germany', 50.1083, 8.7011, 'Frankfurt'); 
INSERT INTO `destination` VALUES (28,'Strase 6','Germany', 50.1083, 8.7011, 'Frankfurt');
INSERT INTO `destination` VALUES (29,'Calle 1','Spain', 40.4168, 3.7346, 'Madrid'); 
INSERT INTO `destination` VALUES (30,'Calle 2','Spain', 40.4178, 3.7396, 'Madrid');
INSERT INTO `destination` VALUES (31,'Calle 3','Spain', 40.4188, 3.7386, 'Madrid');
INSERT INTO `destination` VALUES (32,'Calle 4','Spain', 40.4198, 3.7376, 'Madrid');
INSERT INTO `destination` VALUES (33,'Calle 5','Spain', 40.4138, 3.7366, 'Madrid');
INSERT INTO `destination` VALUES (34,'Calle 6','Spain', 40.4148, 3.7356, 'Madrid');


INSERT INTO bookingdb.airline (`id`,`description`,`name`, `destination_id`) VALUES (1,"Expensive", "Jat Serbia", 1);
INSERT INTO bookingdb.airline (`id`,`description`,`name`, `destination_id`) VALUES (2,"Luxury", "Air UK", 11);
INSERT INTO bookingdb.airline (`id`,`description`,`name`, `destination_id`) VALUES (3,"Cheap", "Air France", 29);
INSERT INTO bookingdb.airline (`id`,`description`,`name`, `destination_id`) VALUES (4,"The best", "Lufthansa", 23);

INSERT INTO `airport` (`id`, `name`, `destination_id`) VALUES (1, "Nikola Tesla", 2);
INSERT INTO `airport` (`id`, `name`, `destination_id`) VALUES (2, "Heathrow", 12);
INSERT INTO `airport` (`id`, `name`, `destination_id`) VALUES (3, "Paris airport", 18);
INSERT INTO `airport` (`id`, `name`, `destination_id`) VALUES (4, "Frankfurt airport", 24);
INSERT INTO `airport` (`id`, `name`, `destination_id`) VALUES (5, "Suarez", 30);

insert into `airline_airport` values (1,1);
insert into `airline_airport` values (1,2);
insert into `airline_airport` values (1,3);
insert into `airline_airport` values (1,4);
insert into `airline_airport` values (1,5);
insert into `airline_airport` values (2,1);
insert into `airline_airport` values (2,2);
insert into `airline_airport` values (2,3);
insert into `airline_airport` values (2,5);
insert into `airline_airport` values (3,2);
insert into `airline_airport` values (3,3);
insert into `airline_airport` values (3,4);
insert into `airline_airport` values (3,5);
insert into `airline_airport` values (4,2);
insert into `airline_airport` values (4,3);

INSERT INTO `flight` (`id`, `airline_id`, `start_airport_id`, `end_airport_id`, `departure_date`, `arrival_date`, `flight_duration`, `flight_length`, `luggage_quantity`, `ticket_price_first_class`, `ticket_price_business_class`, `ticket_price_economy_class`)
VALUES (1, 1, 1, 2, "2019-06-21 10:00:00", "2019-06-22 10:00:00", 24, 500, 1, 300, 250, 200),
	   (2, 1, 1, 2, "2019-06-23 10:00:00", "2019-06-24 10:00:00", 24, 600, 1, 400, 350, 300),
	   (3, 1, 2, 3, "2019-06-21 10:00:00", "2019-06-22 10:00:00", 24, 700, 1, 300, 250, 200),
	   (4, 1, 3, 2, "2019-06-23 10:00:00", "2019-06-24 10:00:00", 24, 150, 1, 400, 350, 300),
	   (5, 2, 3, 2, "2019-06-24 10:00:00", "2019-06-25 10:00:00", 24, 250, 1, 300, 250, 200),
	   (6, 2, 5, 3, "2019-06-23 10:00:00", "2019-06-24 10:00:00", 24, 1000, 1, 400, 350, 300),
	   (7, 2, 1, 5, "2019-06-26 10:00:00", "2019-06-27 10:00:00", 24, 140, 1, 400, 350, 300),
	   (8, 3, 2, 4, "2019-06-27 10:00:00", "2019-06-28 10:00:00", 24, 480, 1, 400, 350, 300),
	   (9, 3, 2, 5, "2019-06-23 10:00:00", "2019-06-24 10:00:00", 24, 950, 1, 400, 350, 300),
	   (10, 3, 4, 3, "2019-06-24 10:00:00", "2019-06-25 10:00:00", 24, 300, 1, 400, 350, 300),
	   (11, 4, 2, 3, "2019-06-28 10:00:00", "2019-06-29 10:00:00", 24, 450, 1, 400, 350, 300),
	   (12, 4, 2, 3, "2019-06-27 10:00:00", "2019-06-28 10:00:00", 24, 700, 1, 400, 350, 300),
	   (13, 4, 3, 2, "2019-06-30 10:00:00", "2019-07-01 10:00:00", 24, 650, 1, 400, 350, 300);

INSERT INTO `seat` (`id`, `flight_id`, `busy`, `enabled`, `seat_row`, `number`, `type`) 
VALUES (1, 1, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (2, 1, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (3, 1, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (4, 1, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (5, 1, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (6, 1, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (7, 1, b'0', b'1', 3, 1, "BUSINESS"),
	   (8, 1, b'0', b'1', 3, 2, "BUSINESS"),
	   (9, 1, b'0', b'1', 3, 3, "BUSINESS"),
	   (10, 1, b'0', b'1', 4, 1, "BUSINESS"),
	   (11, 1, b'0', b'1', 4, 2, "BUSINESS"),
	   (12, 1, b'0', b'1', 4, 3, "BUSINESS"),
	   (13, 1, b'0', b'1', 5, 1, "ECONOMY"),
	   (14, 1, b'0', b'1', 5, 2, "ECONOMY"),
	   (15, 1, b'0', b'1', 5, 3, "ECONOMY"),
	   (16, 1, b'0', b'1', 6, 1, "ECONOMY"),
	   (17, 1, b'0', b'1', 6, 2, "ECONOMY"),
	   (18, 1, b'0', b'1', 6, 3, "ECONOMY"),
	   (19, 2, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (20, 2, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (21, 2, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (22, 2, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (23, 2, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (24, 2, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (25, 2, b'0', b'1', 3, 1, "BUSINESS"),
	   (26, 2, b'0', b'1', 3, 2, "BUSINESS"),
	   (27, 2, b'0', b'1', 3, 3, "BUSINESS"),
	   (28, 2, b'0', b'1', 4, 1, "BUSINESS"),
	   (29, 2, b'0', b'1', 4, 2, "BUSINESS"),
	   (30, 2, b'0', b'1', 4, 3, "BUSINESS"),
	   (31, 2, b'0', b'1', 5, 1, "ECONOMY"),
	   (32, 2, b'0', b'1', 5, 2, "ECONOMY"),
	   (33, 2, b'0', b'1', 5, 3, "ECONOMY"),
	   (34, 2, b'0', b'1', 6, 1, "ECONOMY"),
	   (35, 2, b'0', b'1', 6, 2, "ECONOMY"),
	   (36, 2, b'0', b'1', 6, 3, "ECONOMY"),
	   (37, 3, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (38, 3, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (39, 3, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (40, 3, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (41, 3, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (42, 3, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (43, 3, b'0', b'1', 3, 1, "BUSINESS"),
	   (44, 3, b'0', b'1', 3, 2, "BUSINESS"),
	   (45, 3, b'0', b'1', 3, 3, "BUSINESS"),
	   (46, 3, b'0', b'1', 4, 1, "BUSINESS"),
	   (47, 3, b'0', b'1', 4, 2, "BUSINESS"),
	   (48, 3, b'0', b'1', 4, 3, "BUSINESS"),
	   (49, 3, b'0', b'1', 5, 1, "ECONOMY"),
	   (50, 3, b'0', b'1', 5, 2, "ECONOMY"),
	   (51, 3, b'0', b'1', 5, 3, "ECONOMY"),
	   (52, 3, b'0', b'1', 6, 1, "ECONOMY"),
	   (53, 3, b'0', b'1', 6, 2, "ECONOMY"),
	   (54, 3, b'0', b'1', 6, 3, "ECONOMY"),
	   (55, 4, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (56, 4, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (57, 4, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (58, 4, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (59, 4, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (60, 4, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (61, 4, b'0', b'1', 3, 1, "BUSINESS"),
	   (62, 4, b'0', b'1', 3, 2, "BUSINESS"),
	   (63, 4, b'0', b'1', 3, 3, "BUSINESS"),
	   (64, 4, b'0', b'1', 4, 1, "BUSINESS"),
	   (65, 4, b'0', b'1', 4, 2, "BUSINESS"),
	   (66, 4, b'0', b'1', 4, 3, "BUSINESS"),
	   (67, 4, b'0', b'1', 5, 1, "ECONOMY"),
	   (68, 4, b'0', b'1', 5, 2, "ECONOMY"),
	   (69, 4, b'0', b'1', 5, 3, "ECONOMY"),
	   (70, 4, b'0', b'1', 6, 1, "ECONOMY"),
	   (71, 4, b'0', b'1', 6, 2, "ECONOMY"),
	   (72, 4, b'0', b'1', 6, 3, "ECONOMY"),
	   (73, 5, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (74, 5, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (75, 5, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (76, 5, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (77, 5, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (78, 5, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (79, 5, b'0', b'1', 3, 1, "BUSINESS"),
	   (80, 5, b'0', b'1', 3, 2, "BUSINESS"),
	   (81, 5, b'0', b'1', 3, 3, "BUSINESS"),
	   (82, 5, b'0', b'1', 4, 1, "BUSINESS"),
	   (83, 5, b'0', b'1', 4, 2, "BUSINESS"),
	   (84, 5, b'0', b'1', 4, 3, "BUSINESS"),
	   (85, 5, b'0', b'1', 5, 1, "ECONOMY"),
	   (86, 5, b'0', b'1', 5, 2, "ECONOMY"),
	   (87, 5, b'0', b'1', 5, 3, "ECONOMY"),
	   (88, 5, b'0', b'1', 6, 1, "ECONOMY"),
	   (89, 5, b'0', b'1', 6, 2, "ECONOMY"),
	   (90, 5, b'0', b'1', 6, 3, "ECONOMY"),
	   (91, 6, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (92, 6, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (93, 6, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (94, 6, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (95, 6, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (96, 6, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (97, 6, b'0', b'1', 3, 1, "BUSINESS"),
	   (98, 6, b'0', b'1', 3, 2, "BUSINESS"),
	   (99, 6, b'0', b'1', 3, 3, "BUSINESS"),
	   (100, 6, b'0', b'1', 4, 1, "BUSINESS"),
	   (101, 6, b'0', b'1', 4, 2, "BUSINESS"),
	   (102, 6, b'0', b'1', 4, 3, "BUSINESS"),
	   (103, 6, b'0', b'1', 5, 1, "ECONOMY"),
	   (104, 6, b'0', b'1', 5, 2, "ECONOMY"),
	   (105, 6, b'0', b'1', 5, 3, "ECONOMY"),
	   (106, 6, b'0', b'1', 6, 1, "ECONOMY"),
	   (107, 6, b'0', b'1', 6, 2, "ECONOMY"),
	   (108, 6, b'0', b'1', 6, 3, "ECONOMY"),
	   (109, 7, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (110, 7, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (111, 7, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (112, 7, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (113, 7, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (114, 7, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (115, 7, b'0', b'1', 3, 1, "BUSINESS"),
	   (116, 7, b'0', b'1', 3, 2, "BUSINESS"),
	   (117, 7, b'0', b'1', 3, 3, "BUSINESS"),
	   (118, 7, b'0', b'1', 4, 1, "BUSINESS"),
	   (119, 7, b'0', b'1', 4, 2, "BUSINESS"),
	   (120, 7, b'0', b'1', 4, 3, "BUSINESS"),
	   (121, 7, b'0', b'1', 5, 1, "ECONOMY"),
	   (122, 7, b'0', b'1', 5, 2, "ECONOMY"),
	   (123, 7, b'0', b'1', 5, 3, "ECONOMY"),
	   (124, 7, b'0', b'1', 6, 1, "ECONOMY"),
	   (125, 7, b'0', b'1', 6, 2, "ECONOMY"),
	   (126, 7, b'0', b'1', 6, 3, "ECONOMY"),
	   (127, 8, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (128, 8, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (129, 8, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (130, 8, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (131, 8, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (132, 8, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (133, 8, b'0', b'1', 3, 1, "BUSINESS"),
	   (134, 8, b'0', b'1', 3, 2, "BUSINESS"),
	   (135, 8, b'0', b'1', 3, 3, "BUSINESS"),
	   (136, 8, b'0', b'1', 4, 1, "BUSINESS"),
	   (137, 8, b'0', b'1', 4, 2, "BUSINESS"),
	   (138, 8, b'0', b'1', 4, 3, "BUSINESS"),
	   (139, 8, b'0', b'1', 5, 1, "ECONOMY"),
	   (140, 8, b'0', b'1', 5, 2, "ECONOMY"),
	   (141, 8, b'0', b'1', 5, 3, "ECONOMY"),
	   (142, 8, b'0', b'1', 6, 1, "ECONOMY"),
	   (143, 8, b'0', b'1', 6, 2, "ECONOMY"),
	   (144, 8, b'0', b'1', 6, 3, "ECONOMY"),
	   (145, 9, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (146, 9, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (147, 9, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (148, 9, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (149, 9, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (150, 9, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (151, 9, b'0', b'1', 3, 1, "BUSINESS"),
	   (152, 9, b'0', b'1', 3, 2, "BUSINESS"),
	   (153, 9, b'0', b'1', 3, 3, "BUSINESS"),
	   (154, 9, b'0', b'1', 4, 1, "BUSINESS"),
	   (155, 9, b'0', b'1', 4, 2, "BUSINESS"),
	   (156, 9, b'0', b'1', 4, 3, "BUSINESS"),
	   (157, 9, b'0', b'1', 5, 1, "ECONOMY"),
	   (158, 9, b'0', b'1', 5, 2, "ECONOMY"),
	   (159, 9, b'0', b'1', 5, 3, "ECONOMY"),
	   (160, 9, b'0', b'1', 6, 1, "ECONOMY"),
	   (161, 9, b'0', b'1', 6, 2, "ECONOMY"),
	   (162, 9, b'0', b'1', 6, 3, "ECONOMY"),
	   (163, 9, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (164, 9, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (165, 9, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (166, 9, b'0', b'1', 4, 1, "BUSINESS"),
	   (167, 9, b'0', b'1', 4, 2, "BUSINESS"),
	   (168, 9, b'0', b'1', 4, 3, "BUSINESS"),
	   (169, 9, b'0', b'1', 6, 1, "ECONOMY"),
	   (170, 9, b'0', b'1', 6, 2, "ECONOMY"),
	   (171, 9, b'0', b'1', 6, 3, "ECONOMY"),
	   (172, 9, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (173, 9, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (174, 9, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (175, 9, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (176, 9, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (177, 9, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (178, 9, b'0', b'1', 3, 1, "BUSINESS"),
	   (179, 9, b'0', b'1', 3, 2, "BUSINESS"),
	   (180, 9, b'0', b'1', 3, 3, "BUSINESS"),
	   (181, 9, b'0', b'1', 4, 1, "BUSINESS"),
	   (182, 9, b'0', b'1', 4, 2, "BUSINESS"),
	   (183, 9, b'0', b'1', 4, 3, "BUSINESS"),
	   (184, 9, b'0', b'1', 5, 1, "ECONOMY"),
	   (185, 9, b'0', b'1', 5, 2, "ECONOMY"),
	   (186, 9, b'0', b'1', 5, 3, "ECONOMY"),
	   (187, 9, b'0', b'1', 6, 1, "ECONOMY"),
	   (188, 9, b'0', b'1', 6, 2, "ECONOMY"),
	   (189, 9, b'0', b'1', 6, 3, "ECONOMY"),
	   (190, 9, b'0', b'1', 1, 1, "FIRST_CLASS"),
	   (191, 9, b'0', b'1', 1, 2, "FIRST_CLASS"),
	   (192, 9, b'0', b'1', 1, 3, "FIRST_CLASS"),
	   (193, 9, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (194, 9, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (195, 9, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (196, 9, b'0', b'1', 3, 1, "BUSINESS"),
	   (197, 9, b'0', b'1', 3, 2, "BUSINESS"),
	   (198, 9, b'0', b'1', 3, 3, "BUSINESS"),
	   (199, 9, b'0', b'1', 4, 1, "BUSINESS"),
	   (200, 9, b'0', b'1', 4, 2, "BUSINESS"),
	   (201, 9, b'0', b'1', 4, 3, "BUSINESS"),
	   (202, 9, b'0', b'1', 5, 1, "ECONOMY"),
	   (203, 9, b'0', b'1', 5, 2, "ECONOMY"),
	   (204, 9, b'0', b'1', 5, 3, "ECONOMY"),
	   (205, 9, b'0', b'1', 6, 1, "ECONOMY"),
	   (206, 9, b'0', b'1', 6, 2, "ECONOMY"),
	   (207, 9, b'0', b'1', 6, 3, "ECONOMY"),
	   (208, 9, b'0', b'1', 2, 1, "FIRST_CLASS"),
	   (209, 9, b'0', b'1', 2, 2, "FIRST_CLASS"),
	   (210, 9, b'0', b'1', 2, 3, "FIRST_CLASS"),
	   (211, 9, b'0', b'1', 4, 1, "BUSINESS"),
	   (212, 9, b'0', b'1', 4, 2, "BUSINESS"),
	   (213, 9, b'0', b'1', 4, 3, "BUSINESS"),
	   (214, 9, b'0', b'1', 6, 1, "ECONOMY"),
	   (215, 9, b'0', b'1', 6, 2, "ECONOMY"),
	   (216, 9, b'0', b'1', 6, 3, "ECONOMY");
	  
INSERT INTO `sales` values (1, 5, "Discount based on bonus points");

INSERT INTO `hotel` values (1, "Fancy, good for family trips", 0, "Hotel Jugoslavija", 3);
INSERT INTO `hotel` values (2, "Near park", 0, "Hotel Srbija", 4);
INSERT INTO `hotel` values (3, "Quite, near sea coast", 0, "Aqua", 13);
INSERT INTO `hotel` values (4, "In center of London", 0, "Glux", 14);
INSERT INTO `hotel` values (5, "All inclusive", 0, "Dior hotel", 19);
INSERT INTO `hotel` values (6, "Quite, near music festival coast", 0, "Franx Hotel", 25);
INSERT INTO `hotel` values (7, "In center of Madrid", 0, "Silvia Hotel", 31);
INSERT INTO `hotel` values (8, "All inclusive", 0, "Carlos Hotel", 32);

INSERT INTO `hotel_service` values (1, "Pool", 5, 1);
INSERT INTO `hotel_service` values (2, "Barbecue", 6, 1);
INSERT INTO `hotel_service` values (3, "Air condition", 5, 1);
INSERT INTO `hotel_service` values (4, "Coctail party", 7, 1);
INSERT INTO `hotel_service` values (5, "Pool", 3, 2);
INSERT INTO `hotel_service` values (6, "Barbecue", 4, 2);
INSERT INTO `hotel_service` values (7, "Air condition", 6, 2);
INSERT INTO `hotel_service` values (8, "Coctail party", 7, 3);
INSERT INTO `hotel_service` values (9, "Pool", 7, 3);
INSERT INTO `hotel_service` values (10, "Barbecue", 5, 3);
INSERT INTO `hotel_service` values (11, "Air condition", 12, 4);
INSERT INTO `hotel_service` values (12, "Pool", 11, 4);
INSERT INTO `hotel_service` values (13, "Coctail party", 7, 5);
INSERT INTO `hotel_service` values (14, "Pool", 7, 5);
INSERT INTO `hotel_service` values (15, "Barbecue", 5, 5);
INSERT INTO `hotel_service` values (16, "Air condition", 12, 6);
INSERT INTO `hotel_service` values (17, "Pool", 11, 6);
INSERT INTO `hotel_service` values (18, "Coctail party", 7, 7);
INSERT INTO `hotel_service` values (19, "Pool", 7, 7);
INSERT INTO `hotel_service` values (20, "Barbecue", 5, 7);
INSERT INTO `hotel_service` values (21, "Air condition", 12, 8);
INSERT INTO `hotel_service` values (22, "Pool", 11, 8);

INSERT INTO `room` values (1, 2, 1, 20, 101, 1);
INSERT INTO `room` values (2, 2, 1, 20, 102, 1);
INSERT INTO `room` values (3, 3, 1, 25, 103, 1);
INSERT INTO `room` values (4, 3, 2, 25, 201, 1);
INSERT INTO `room` values (5, 4, 2, 30, 202, 1);
INSERT INTO `room` values (6, 2, 1, 15, 101, 2);
INSERT INTO `room` values (7, 3, 1, 17, 102, 2);
INSERT INTO `room` values (8, 3, 1, 17, 103, 2);
INSERT INTO `room` values (9, 3, 1, 17, 104, 2);
INSERT INTO `room` values (10, 4, 2, 22, 201, 2);
INSERT INTO `room` values (11, 4, 2, 22, 202, 2);
INSERT INTO `room` values (12, 2, 1, 15, 101, 3);
INSERT INTO `room` values (13, 3, 2, 20, 201, 3);
INSERT INTO `room` values (14, 4, 2, 25, 202, 3);
INSERT INTO `room` values (15, 2, 1, 15, 101, 4);
INSERT INTO `room` values (16, 2, 1, 15, 102, 4);
INSERT INTO `room` values (17, 3, 1, 22, 103, 4);
INSERT INTO `room` values (18, 2, 1, 20, 101, 5);
INSERT INTO `room` values (19, 2, 1, 20, 102, 5);
INSERT INTO `room` values (20, 3, 1, 25, 103, 5);
INSERT INTO `room` values (21, 3, 2, 25, 201, 5);
INSERT INTO `room` values (22, 4, 2, 30, 202, 5);
INSERT INTO `room` values (23, 2, 1, 15, 101, 6);
INSERT INTO `room` values (24, 3, 1, 17, 102, 6);
INSERT INTO `room` values (25, 3, 1, 17, 103, 6);
INSERT INTO `room` values (26, 3, 1, 17, 104, 6);
INSERT INTO `room` values (27, 4, 2, 22, 201, 6);
INSERT INTO `room` values (28, 4, 2, 22, 202, 6);
INSERT INTO `room` values (29, 2, 1, 15, 101, 7);
INSERT INTO `room` values (30, 3, 2, 20, 201, 7);
INSERT INTO `room` values (31, 4, 2, 25, 202, 7);
INSERT INTO `room` values (32, 2, 1, 15, 101, 8);
INSERT INTO `room` values (33, 2, 1, 15, 102, 8);
INSERT INTO `room` values (34, 3, 1, 22, 103, 8);

INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (1,"Widespread", "Fent Rent", 5);
INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (2,"Reliable", "Rent Rent", 6);
INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (3,"Cheap", "Deus Rent", 15);
INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (4,"Expensive", "Uni Rent", 20);
INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (5,"Cheap", "Gurkinen Rent", 26);
INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (6,"Expensive", "Espanol Rent",33);

INSERT INTO bookingdb.rent_a_car_service (`id`, `name`, `price`, `rent_a_car_id`, `vehicle_reservation_id`) values (1, 'Air conditioner', 10, 1, null);
INSERT INTO bookingdb.rent_a_car_service (`id`, `name`, `price`, `rent_a_car_id`, `vehicle_reservation_id`) values (2, 'Sidecar', 100, 1, null);

INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (1,7,1); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (2,8,1); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (3,9,2);
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (4,10,2); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (5,16,3);  
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (6,17,3); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (7,21,4);
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (8,22,4); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (9,27,5);
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (10,28,5); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (11,34,6);

INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (1, "BMW", "X5", 100, 2005, 4, "CAR", 1, 1);  
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (2, "Audi", "A7", 200, 2006, 4, "CAR", 2, 1);  
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (3, "Porsche", "Cayenne", 200, 2010, 4, "CAR", 2, 1);  
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (4, "Volkswagen", "Golf 6", 90, 2015, 4, "CAR", 3, 1);  
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (5, "Porsche", "Panamera", 170, 2009, 4, "CAR", 4, 2);
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (6, "Porsche", "Targa 4S", 260, 2017, 4, "CAR", 5, 2);
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (7, "Harley Davidson", "Iron 883", 170, 2019, 1, "MOTOCYCLE", 4, 2);
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (8, "Yamaha", "N MAX 125", 70, 2015, 2, "MOTOCYCLE", 1, 1);

INSERT INTO `users` values ("SystemAdmin", 1, "Novi Sad", "sysadmin@gmail.com", b'1', "Lisa", "Tobias", '2019-06-10 00:00:01', "$2a$10$CCCR0ZK7vfrJsrKHKWeanuYpuchsLOaACUWIXmZFOl7Np3qAJHvX2", b'1', "021/542122", "system", 0, b'1', null,null,null);
INSERT INTO `users` values ("RegisteredUser", 2, "Madrid", "user1@gmail.com", b'1', "Rocky", "Balboa", '2019-06-10 04:00:01', "$2a$10$23uC9cD//AG1wBl3UBK8eO6fmisGo00jEOSp/xFLAOeaZ6ISkQ396", b'1', "021/35353", "user1", 0, b'1', null,null,null);
INSERT INTO `users` values ("RegisteredUser", 3, "Beograd", "user2@gmail.com", b'1', "Harry", "Potter", '2019-06-12 04:00:01', "$2a$10$5D0Ew/t/773X3k8We3PNWeTjC65GrhDS4uwLZEyr6MaiGU3mTTJca", b'1', "021/35353", "user2", 0, b'1', null,null,null);
INSERT INTO `users` values ("RegisteredUser", 4, "New York", "user3@gmail.com", b'1', "Frodo", "Baggins", '2019-06-12 04:00:01', "$2a$10$YsngqlDx/4aI7dx2kC2jROl53qD9MIbsK6.3KBhe8eluZwKi7ayvy", b'1', "021/35353", "user3", 0, b'1', null,null,null);
INSERT INTO `users` values ("AirlineAdmin", 5, "Rome", "airlineadmin1@gmail.com", b'1', "Aleksa", "Aleksic", '2019-06-10 07:00:01', "$2a$10$A7Csp98n2w.UmhQMCnIe4ujgPKbahoBX1mBt2mRJ9TpXjL2uqIA7O", b'0', "021/75223", "airline1", 0, b'1', null,1,null);
INSERT INTO `users` values ("AirlineAdmin", 6, "Berlin", "airlineadmin2@gmail.com", b'1', "Marko", "Markovic", '2019-06-12 07:00:01', "$2a$10$/5W6j.EO7WEm.nn19HdtPezGUtW1iFEfmjdd3tLHVAAl16J6oQG2i", b'0', "021/751324", "airline2", 0, b'1', null,1,null);
INSERT INTO `users` values ("AirlineAdmin", 7, "Moscow", "airlineadmin3@gmail.com", b'1', "Dusan", "Bulat", '2019-06-12 07:00:01', "$2a$10$wtxa0A87Q3f.iGTMemOrcuNo4fyN1Dt4mKwpkRDgOvZ6O/lCiLgki", b'0', "021/123456", "airline3", 0, b'1', null,2,null);

INSERT INTO `users` values ("HotelAdmin", 8, "Belgrade", "hoteladmin1@gmail.com", b'1', "Ivana", "Pilipovic", '2019-06-10 05:00:01', "$2a$10$hoq.VzmKG5MiNP.wUkOHOuR8JtZdoiHerw/xX1KT14C..mTJUVSee", b'0', "021/314341", "hotel1", 0, b'1', null,null,1);
INSERT INTO `users` values ("HotelAdmin", 9, "Berlin", "hoteladmin2@gmail.com", b'1', "Didier", "Drogba", '2019-06-10 05:03:15', "$2a$10$O/x6gHNlvHh6zTNJ0Nk95elgPYSNihmzyDLb8FPxmD8QQ2Z06Oe3e", b'0', "021/25353", "hotel2", 0, b'1', null,null,2);
INSERT INTO `users` values ("HotelAdmin", 10, "Berlin", "hoteladmin3@gmail.com", b'1', "Marko", "Rakic", '2019-06-10 05:04:15', "$2a$10$SWlbuvzJbdb02CVmdzwRhOKv9q54B/DDXg.HgAq8YzGRdd.7cv2We", b'0', "021/32422", "hotel3", 0, b'1', null,null,3);
INSERT INTO `users` values ("HotelAdmin", 11, "Berlin", "hoteladmin4@gmail.com", b'1', "Matias", "Takic", '2019-06-10 05:03:15', "$2a$10$Ef0jsgAxDS2I3M/akIF/IOQEK5BKhneympIWPTUAI3x3YWjq0O/k2", b'0', "021/53252", "hotel4", 0, b'1', null,null,4);
INSERT INTO `users` values ("HotelAdmin", 12, "Berlin", "hoteladmin5@gmail.com", b'1', "Lidija", "Makic", '2019-06-10 06:03:15', "$2a$10$zXJpyhlLUFsufuviS.BCiuZnFXLLXF0S3dRHR6s3RMb2PdCDbXrl.", b'0', "021/76575", "hotel5", 0, b'1', null,null,5);
INSERT INTO `users` values ("HotelAdmin", 13, "Berlin", "hoteladmin6@gmail.com", b'1', "Sonja", "Bakic", '2019-06-10 07:03:15', "$2a$10$dZicaqStkk.DRidsgioXiOzPOUEb14a6wvEkxZAoafQ6VeSTbVtE.", b'0', "021/854333", "hotel6", 0, b'1', null,null,6);
INSERT INTO `users` values ("HotelAdmin", 14, "Moscow", "hoteladmin7@gmail.com", b'1', "Milica", "Rubio", '2019-06-10 08:10:01', "$2a$10$skmxO1NqBLCKgtW9/BkL4OrJi0R2X8Ic.C7XaQ7RuwPreZZmBMWOW", b'0', "021/315111", "hotel7", 0, b'1', null,null,7);
INSERT INTO `users` values ("HotelAdmin", 15, "Minsk", "hoteladmin8@gmail.com", b'1', "Ksenija", "Golsky", '2019-06-10 09:04:15', "$2a$10$dWH8WqUfpISc6HfiRe0lV.rVZGqjLJWgPpOWeXhJNduq4Ve92XAGi", b'0', "021/344444", "hotel8", 0, b'1', null,null,8);
INSERT INTO `users` values ("HotelAdmin", 16, "Tokyo", "hoteladmin9@gmail.com", b'1', "Satoshi", "Ishii", '2019-06-10 10:04:15', "$2a$10$9sTCv7/UNQweelFYr55VWecDopBNzzYmddcozht8XRnq2cFJkR6Ky", b'0', "021/612133", "hotel9", 0, b'1', null,null,1);

INSERT INTO `users` values ("RentACarAdmin", 17, "London", "rentadmin1@gmail.com", b'1', "Marko", "Markovic", '2019-06-10 06:00:01', "$2a$10$4m4AQOA/SYTP0vS134NlWecvMsK9ri8lM6DHi/nMshnPwaEN4QKCO", b'0', "021/123123", "rent1", 0, b'1', 1,null,null);
INSERT INTO `users` values ("RentACarAdmin", 18, "Sydney", "rentadmin2@gmail.com", b'1', "Jovana", "Jovic", '2019-06-15 06:00:01', "$2a$10$N.OsAXfsAL/GjeAVDbtyy.sUu0k0MJsAyvmQtEtj/Kv1GUzZVGvsO", b'0', "021/461443", "rent2", 0, b'1', 2,null,null);
INSERT INTO `users` values ("RentACarAdmin", 19, "Melbourne", "rentadmin3@gmail.com", b'1', "Marija", "Novakovic", '2019-06-10 06:00:01', "$2a$10$bCqhROVlKCZeei8hD584qe4BRtaSlbg9DvulMI95GswwcNzdje4qO", b'0', "021/116155", "rent3", 0, b'1', 3,null,null);
INSERT INTO `users` values ("RentACarAdmin", 20, "Barcelona", "rentadmin4@gmail.com", b'1', "Dusan", "Antic", '2019-06-10 08:06:01', "$2a$10$SPAVswzgoaaWsx7a6iO69uT19Bvs5HpY6zAkyd4Ey9Eh8SPtLkkeC", b'0', "021/351611", "rent4", 0, b'1', 4,null,null);
INSERT INTO `users` values ("RentACarAdmin", 21, "Mallorca", "rentadmin5@gmail.com", b'1', "Borko", "Batic", '2019-06-10 07:07:01', "$2a$10$No1ac96l8WG3cc7fB1gXLensViM.sFW7aVFe3N65YY9ztRs3cbLRe", b'0', "021/13411", "rent5", 0, b'1', 1,null,null);


INSERT INTO `user_authority` values (1, 5);
INSERT INTO `user_authority` values (2, 1);
INSERT INTO `user_authority` values (3, 1);
INSERT INTO `user_authority` values (4, 1);
INSERT INTO `user_authority` values (5, 2);
INSERT INTO `user_authority` values (6, 2);
INSERT INTO `user_authority` values (7, 2);
INSERT INTO `user_authority` values (8, 3);
INSERT INTO `user_authority` values (9, 3);
INSERT INTO `user_authority` values (10, 3);
INSERT INTO `user_authority` values (11, 3);
INSERT INTO `user_authority` values (12, 3);
INSERT INTO `user_authority` values (13, 3);
INSERT INTO `user_authority` values (14, 3);
INSERT INTO `user_authority` values (15, 3);
INSERT INTO `user_authority` values (16, 3);
INSERT INTO `user_authority` values (17, 4);
INSERT INTO `user_authority` values (18, 4);
INSERT INTO `user_authority` values (19, 4);
INSERT INTO `user_authority` values (20, 4);
INSERT INTO `user_authority` values (21, 4);