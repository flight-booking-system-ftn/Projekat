INSERT INTO `authorities` values (1, "ROLE_REGISTEREDUSER");
INSERT INTO `authorities` values (2, "ROLE_AIRLINEADMIN");
INSERT INTO `authorities` values (3, "ROLE_HOTELADMIN");
INSERT INTO `authorities` values (4, "ROLE_RENTACARADMIN");
INSERT INTO `authorities` values (5, "ROLE_SYSTEMADMIN");

INSERT INTO `destination` VALUES (1,'Serbia', 44.75, 20.44, 'Belgrade'); 
INSERT INTO `destination` VALUES (2,'Serbia', 45.75, 16.44, 'Novi Sad'); 
INSERT INTO `destination` VALUES (3,'USA', 31.75, 25.44, 'Boston'); 
INSERT INTO `destination` VALUES (4,'China', 15.75, 24.44, 'Shangai'); 
INSERT INTO `destination` VALUES (5,'Japan', 11.75, 20.44, 'Tokyo'); 

INSERT INTO `hotel` values (1, "Fancy, good for family trips", "4 seasons", 1);
INSERT INTO `hotel` values (2, "Quite, near sea coast", "Aqua", 2);
INSERT INTO `hotel` values (3, "In center of Tokyo", "TokyoCampSide", 5);
INSERT INTO `hotel` values (4, "All inclusive", "Harito", 4);

INSERT INTO `hotel_service` values (1, "Pool", 5, 1);
INSERT INTO `hotel_service` values (2, "Barbaque", 6, 1);
INSERT INTO `hotel_service` values (3, "Air condition", 5, 1);
INSERT INTO `hotel_service` values (4, "Coctail party", 7, 1);
INSERT INTO `hotel_service` values (5, "Pool", 3, 2);
INSERT INTO `hotel_service` values (6, "Barbaque", 4, 2);
INSERT INTO `hotel_service` values (7, "Air condition", 6, 2);
INSERT INTO `hotel_service` values (8, "Coctail party", 7, 3);
INSERT INTO `hotel_service` values (9, "Pool", 7, 3);
INSERT INTO `hotel_service` values (10, "Barbaque", 5, 3);
INSERT INTO `hotel_service` values (11, "Air condition", 12, 4);
INSERT INTO `hotel_service` values (12, "Pool", 11, 4);

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


INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (1,"Widespread", "Fent Rent", 1);
INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (2,"Reliable", "Rent Rent", 2);
INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (3,"Cheap", "Deus Rent", 3);
INSERT INTO bookingdb.rent_a_car (`id`,`description`,`name`, `destination_id`) VALUES (4,"Expensive", "Uni Rent", 4);

INSERT INTO bookingdb.rent_a_car_service (`id`, `name`, `price`, `rent_a_car_id`, `vehicle_reservation_id`) values (1, 'Air conditioner', 10, 1, null);
INSERT INTO bookingdb.rent_a_car_service (`id`, `name`, `price`, `rent_a_car_id`, `vehicle_reservation_id`) values (2, 'Sidecar', 100, 1, null);

INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (1,1,1); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (2,2,1); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (3,3,1);
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (4,4,2); 
INSERT INTO bookingdb.branch_office (`id`,`destination_id`,`rent_a_car_id`) VALUES (5,5,2);  

INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (1, "BMW", "X5", 100, 2005, 4, "CAR", 1, 1);  
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (2, "Audi", "A7", 200, 2006, 4, "CAR", 2, 1);  
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (3, "Porsche", "Cayenne", 200, 2010, 4, "CAR", 2, 1);  
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (4, "Volkswagen", "Golf 6", 90, 2015, 4, "CAR", 3, 1);  
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (5, "Porsche", "Panamera", 170, 2009, 4, "CAR", 4, 2);
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (6, "Porsche", "Targa 4S", 260, 2017, 4, "CAR", 5, 2);
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (7, "Harley Davidson", "Iron 883", 170, 2019, 1, "MOTOCYCLE", 4, 2);
INSERT INTO bookingdb.vehicle (`id`,`brand`,`model`, `price`, `production_year`, `seats_number`, `type`, `branch_office_id`, `rent_a_car_id`) VALUES (8, "Yamaha", "N MAX 125", 70, 2015, 2, "MOTOCYCLE", 1, 1);  

INSERT INTO bookingdb.airline (`id`,`description`,`name`, `destination_id`) VALUES (1,"Expensive", "Jat Airways", 1);

INSERT INTO `users` values ("SystemAdmin", 1, "Novi Sad", "sysadmin@gmail.com", b'1', "Lisa", "Tobias", '2019-06-10 00:00:01', "$2a$10$CCCR0ZK7vfrJsrKHKWeanuYpuchsLOaACUWIXmZFOl7Np3qAJHvX2", "021/542122", "system", 0, b'1', null,null,null);
INSERT INTO `users` values ("RegisteredUser", 2, "Madrid", "user@gmail.com", b'1', "Rocky", "Balboa", '2019-06-10 04:00:01', "$2a$10$H3nTZCNfbrfZw.j3P05VQuzBElODLH.8hxDYnv/.E4qs72qPdNXJC", "021/35353", "user", 0, b'1', null,null,null);
INSERT INTO `users` values ("HotelAdmin", 3, "Belgrade", "hoteladmin1@gmail.com", b'1', "Ivana", "Pilipovic", '2019-06-10 05:00:01', "$2a$10$qdZEONYNX5XMqpoSoaLkBusSaM2biXeiCCgDx8cAMvnnGSV56.9By", "021/314341", "hotel1", 0, b'1', null,null,1);
INSERT INTO `users` values ("RentACarAdmin", 4, "London", "rentadmin1@gmail.com", b'1', "Marko", "Markovic", '2019-06-10 06:00:01', "$2a$10$4m4AQOA/SYTP0vS134NlWecvMsK9ri8lM6DHi/nMshnPwaEN4QKCO", "021/123123", "rent1", 0, b'1', 1,null,null);
INSERT INTO `users` values ("AirlineAdmin", 5, "Rome", "airlineadmin1@gmail.com", b'1', "Aleksa", "Aleksic", '2019-06-10 07:00:01', "$2a$10$A7Csp98n2w.UmhQMCnIe4ujgPKbahoBX1mBt2mRJ9TpXjL2uqIA7O", "021/75223", "airline1", 0, b'1', null,1,null);
INSERT INTO `users` values ("HotelAdmin", 6, "Moscow", "hoteladmin2@gmail.com", b'1', "Ricky", "Rubio", '2019-06-10 08:10:01', "$2a$10$RMjRDqrkmlS44VGS7IZ3HeoiVS.dfg2Z4cDdfLsQCqQvrn8H2lVM2", "021/315111", "hotel2", 0, b'1', null,null,2);
INSERT INTO `users` values ("HotelAdmin", 7, "Minsk", "hoteladmin3@gmail.com", b'1', "Rosky", "Golsky", '2019-04-10 05:04:15', "$2a$10$ZFoshK1nxgpP./nozdv1aOuhJt1XSuIbI3bRFcB/5y3q/My64L50W", "021/344444", "hotel3", 0, b'1', null,null,3);
INSERT INTO `users` values ("HotelAdmin", 8, "Tokyo", "hoteladmin4@gmail.com", b'1', "Satoshi", "Ishii", '2019-06-10 05:04:15', "$2a$10$Tg6HZilBwIaPlMmI3sSA7.hUllSzSmcXma6h7UEtQ5qEfEwwsx7qi", "021/612133", "hotel4", 0, b'1', null,null,4);
INSERT INTO `users` values ("RentACarAdmin", 9, "Sydney", "rentadmin2@gmail.com", b'1', "Jovana", "Jovic", '2019-07-15 06:00:01', "$2a$10$N.OsAXfsAL/GjeAVDbtyy.sUu0k0MJsAyvmQtEtj/Kv1GUzZVGvsO", "021/461443", "rent2", 0, b'1', 2,null,null);
INSERT INTO `users` values ("RentACarAdmin", 10, "Melbourne", "rentadmin3@gmail.com", b'1', "Marija", "Novakovic", '2019-07-11 06:00:01', "$2a$10$bCqhROVlKCZeei8hD584qe4BRtaSlbg9DvulMI95GswwcNzdje4qO", "021/116155", "rent3", 0, b'1', 3,null,null);
INSERT INTO `users` values ("RentACarAdmin", 11, "Barcelona", "rentadmin4@gmail.com", b'1', "Dusan", "Antic", '2019-05-10 08:06:01', "$2a$10$SPAVswzgoaaWsx7a6iO69uT19Bvs5HpY6zAkyd4Ey9Eh8SPtLkkeC", "021/351611", "rent4", 0, b'1', 4,null,null);
INSERT INTO `users` values ("RentACarAdmin", 12, "Mallorca", "rentadmin5@gmail.com", b'1', "Borko", "Batic", '2019-06-10 07:07:01', "$2a$10$No1ac96l8WG3cc7fB1gXLensViM.sFW7aVFe3N65YY9ztRs3cbLRe", "021/13411", "rent5", 0, b'1', 1,null,null);
INSERT INTO `users` values ("HotelAdmin", 13, "Berlin", "hoteladmin5@gmail.com", b'1', "Didier", "Drogba", '2019-07-10 05:03:15', "$2a$10$FDlkpEtkVIJhkvuJ1GjYCud1fuwpQAS.HJCec5GA.Yy4VXLcU7/c6", "021/233333", "hotel5", 0, b'1', null,null,1);

INSERT INTO `user_authority` values (1, 5);
INSERT INTO `user_authority` values (2, 1);
INSERT INTO `user_authority` values (3, 3);
INSERT INTO `user_authority` values (4, 4);
INSERT INTO `user_authority` values (5, 2);
INSERT INTO `user_authority` values (6, 3);
INSERT INTO `user_authority` values (7, 3);
INSERT INTO `user_authority` values (8, 3);
INSERT INTO `user_authority` values (9, 4);
INSERT INTO `user_authority` values (10, 4);
INSERT INTO `user_authority` values (11, 4);
INSERT INTO `user_authority` values (12, 4);
INSERT INTO `user_authority` values (13, 3);

