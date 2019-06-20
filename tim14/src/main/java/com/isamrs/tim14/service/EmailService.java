package com.isamrs.tim14.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.isamrs.tim14.model.RegisteredUser;
import com.isamrs.tim14.model.VerificationToken;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender javaMailSender;

	/*
	 * Koriscenje klase za ocitavanje vrednosti iz application.properties fajla
	 */
	@Autowired
	private Environment env;

	/*
	 * Anotacija za oznacavanje asinhronog zadatka
	 * Vise informacija na: https://docs.spring.io/spring/docs/current/spring-framework-reference/integration.html#scheduling
	 */
	@Autowired
	private VerificationTokenService verificationService;

	@Async
	public void sendNotificaitionAsync(RegisteredUser user, String subject, String message) throws MailException, InterruptedException {

		String token = UUID.randomUUID().toString();
		VerificationToken verToken = new VerificationToken();
		verToken.setId(null);
		verToken.setToken(token);
		verToken.setUser(user);
		verificationService.saveToken(verToken);

		//Simulacija duze aktivnosti da bi se uocila razlika
		Thread.sleep(1000);
		System.out.println("Sending email...");

		SimpleMailMessage mail = new SimpleMailMessage();
		mail.setTo(user.getEmail());
		mail.setFrom(env.getProperty("spring.mail.username"));
		mail.setSubject(subject);
		/*String tekst = null;
		try {
			tekst = String.format("Confirm your registration on this link: \nhttp://localhost:5000/auth/confirm/%s",URLEncoder.encode(token, "UTF-8"));
		} catch (Exception e) {
			e.printStackTrace();
		}*/
		mail.setText(message);
		javaMailSender.send(mail);

		System.out.println("Email sent.");
	}
	
	@Async
	public void sendNotificaitionAsyncRegist(RegisteredUser user, String subject, String message) throws MailException, InterruptedException {

		String token = UUID.randomUUID().toString();
		VerificationToken verToken = new VerificationToken();
		verToken.setId(null);
		verToken.setToken(token);
		verToken.setUser(user);
		verificationService.saveToken(verToken);

		//Simulacija duze aktivnosti da bi se uocila razlika
		Thread.sleep(1000);
		System.out.println("Sending email...");

		SimpleMailMessage mail = new SimpleMailMessage();
		mail.setTo(user.getEmail());
		mail.setFrom(env.getProperty("spring.mail.username"));
		mail.setSubject(subject);
		/*String tekst = null;
		try {
			tekst = String.format("Confirm your registration on this link: \nhttp://localhost:5000/auth/confirm/%s",URLEncoder.encode(token, "UTF-8"));
		} catch (Exception e) {
			e.printStackTrace();
		}*/
		mail.setText(message);
		javaMailSender.send(mail);

		System.out.println("Email sent.");
	}
}
