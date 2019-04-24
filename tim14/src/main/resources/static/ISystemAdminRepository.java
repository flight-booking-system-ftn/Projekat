package com.isamrs.tim14.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.SystemAdmin;
import com.isamrs.tim14.model.User;

public interface ISystemAdminRepository extends JpaRepository<SystemAdmin, Long> {
	List<SystemAdmin> findAll();
}
