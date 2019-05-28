package com.isamrs.tim14.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.isamrs.tim14.model.VerificationToken;

public interface IVerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
	public VerificationToken save(VerificationToken token);
}
