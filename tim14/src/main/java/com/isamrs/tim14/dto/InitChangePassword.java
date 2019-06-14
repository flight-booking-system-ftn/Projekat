package com.isamrs.tim14.dto;

public class InitChangePassword {

	private String currentPassword;
	private String newPassword;
	private String repNewPassword;
	
	public InitChangePassword() {
		
	}

	public String getCurrentPassword() {
		return currentPassword;
	}

	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public String getRepNewPassword() {
		return repNewPassword;
	}

	public void setRepNewPassword(String repNewPassword) {
		this.repNewPassword = repNewPassword;
	}
	
	
}
