package com.isamrs.tim14.dao;

import java.util.ArrayList;

import com.isamrs.tim14.model.RoomReservation;

public interface RoomReservationDAO {
	public RoomReservation save(RoomReservation roomReservation);
	public ArrayList<RoomReservation> getQuickRoomReservations(String hotelID);
	public RoomReservation saveQuick(String roomReservationID);
}
