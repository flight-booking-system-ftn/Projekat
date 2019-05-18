package com.isamrs.tim14.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;

@Entity
@Table(name="Authorities")
public class Authority implements GrantedAuthority {

	private static final long serialVersionUID = 1L;

	@Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
	
	@Column(name = "user_type")
	@Enumerated(EnumType.STRING)
	UserType userType;

    @Override
    public String getAuthority() {
        return userType.toString();
    }

    public void setUserType(UserType type) {
        this.userType = type;
    }

    @JsonIgnore
    public String getUserType() {
        return userType.toString();
    }

    @JsonIgnore
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
