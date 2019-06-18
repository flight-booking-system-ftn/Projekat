package com.isamrs.tim14.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.model.Luggage;
import com.isamrs.tim14.service.LuggageService;

@RestController
@RequestMapping("/luggage")
public class LuggageRest {

	@Autowired
	private LuggageService luggageService;
	
	@PostMapping("/add")
	@PreAuthorize("hasRole('ROLE_AIRLINEADMIN')")
	public ResponseEntity<String> add(@RequestBody Luggage luggage) {
		return luggageService.add(luggage);
	}
	
	@GetMapping("/{id}")
	public Luggage getLuggage(@PathVariable Integer id) {
		return luggageService.getLuggage(id);
	}
}
