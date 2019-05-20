INSERT INTO `users`(`id`, `username`, `password`, `first_name`, `last_name`, `email`, `city`, `phone_number`, `last_password_reset_date`, `bonus_points`, `airline_id`, `rent_a_car_id`, `hotel_id`, `dtype`, `enabled`) values (1, "sysadmin", "$2y$04$yS6bG.M0vEuw/qm2bWYPOOsXFZDFu/wxEmr8IMgYWmSAK.DpuPL4e", "System", "Admin", "sysadmin@gmail.com", "Belgrade", "011/123456", SYSDATE(), 0, null, null, null, "SystemAdmin", b'1');
INSERT INTO `authorities`(`id`, `user_type`) values (1, "ROLE_SYSTEMADMIN");
INSERT INTO `user_authority`(`user_id`, `authority_id`) values (1, 1);
INSERT INTO bookingdb.destination (`id`,`country`,`latitude`,`longitude`,`name`) VALUES (1,'Serbia', 44.75, 20.44, 'Belgrade'); 
INSERT INTO bookingdb.destination (`id`,`country`,`latitude`,`longitude`,`name`) VALUES (2,'Spain', 15.75, 35.44, 'Madrid'); 
