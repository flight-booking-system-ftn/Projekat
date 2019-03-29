package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.User;

public interface IUserRepository extends JpaRepository<User, String> {

}
