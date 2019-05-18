package com.isamrs.tim14.model;

public class UserTokenState {

	private String accessToken;
	private Long expiresIn;
	private UserType userType;
	private String redirectionURL;

	public UserTokenState() {
		this.accessToken = null;
		this.expiresIn = null;
		this.setUserType(null);
		this.redirectionURL = "#";
	}

	public UserTokenState(String accessToken, long expiresIn, UserType userType, String redirect) {
		this.accessToken = accessToken;
		this.expiresIn = expiresIn;
		this.setUserType(userType);
		this.redirectionURL = redirect;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public Long getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(Long expiresIn) {
		this.expiresIn = expiresIn;
	}

	public UserType getUserType() {
		return userType;
	}

	public void setUserType(UserType userType) {
		this.userType = userType;
	}

	public String getRedirectionURL() {
		return redirectionURL;
	}

	public void setRedirectionURL(String redirectionURL) {
		this.redirectionURL = redirectionURL;
	}
}