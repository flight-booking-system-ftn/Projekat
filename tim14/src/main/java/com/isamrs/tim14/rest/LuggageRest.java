package com.isamrs.tim14.rest;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.isamrs.tim14.dao.LuggageDAO;
import com.isamrs.tim14.model.Luggage;

@RestController
@RequestMapping("/luggage")
public class LuggageRest {

	private LuggageDAO luggageDAO;
	
	@Autowired
	public LuggageRest(LuggageDAO luggageDAO) {
		this.luggageDAO = luggageDAO;
	}
	
	@PostMapping("/add")
	public ResponseEntity<String> add(@RequestBody Luggage luggage) {
		return luggageDAO.add(luggage);
	}
	
	@GetMapping("/getPricelist")
	public Set<Luggage> getPricelist() {
		return luggageDAO.getPricelist();
	}
	
}
