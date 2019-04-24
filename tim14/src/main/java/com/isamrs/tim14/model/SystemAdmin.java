package com.isamrs.tim14.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name = "system_admin")
public class SystemAdmin extends User {

	public SystemAdmin() {
		super();
	}
	
}
