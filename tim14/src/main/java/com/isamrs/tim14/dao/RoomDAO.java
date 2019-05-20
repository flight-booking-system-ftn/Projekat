package com.isamrs.tim14.dao;

import java.util.List;

import com.isamrs.tim14.model.Room;

public interface RoomDAO {
	public Room save(Room room);
	public List<Room> getRoomsSearch(Integer hotelID, Long arriveDateTS, Long departureDateTS, Boolean twoBeds, Boolean threeBeds, Boolean fourBeds);
}
