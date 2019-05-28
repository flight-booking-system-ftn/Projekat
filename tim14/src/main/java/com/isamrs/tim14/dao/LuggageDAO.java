package com.isamrs.tim14.dao;

import java.util.Set;

import org.springframework.http.ResponseEntity;

import com.isamrs.tim14.model.Luggage;

public interface LuggageDAO {
	public ResponseEntity<String> add(Luggage luggage);

	public ResponseEntity<Set<Luggage>> getPricelist();
}
