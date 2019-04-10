package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.RegisteredUser;

public interface IRegistrationRepository extends JpaRepository<RegisteredUser, Integer> {

}