package com.isamrs.tim14.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.isamrs.tim14.model.VerificationToken;
import com.isamrs.tim14.repository.IVerificationTokenRepository;

@Service
public class VerificationTokenService {
	@Autowired
	private IVerificationTokenRepository verificationTokenRepository;

	public void saveToken(VerificationToken token) {
		verificationTokenRepository.save(token);
	}

}
