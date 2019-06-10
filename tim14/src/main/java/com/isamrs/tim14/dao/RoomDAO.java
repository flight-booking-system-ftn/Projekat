package com.isamrs.tim14.dao;

import java.util.Collection;
import java.util.List;

import com.isamrs.tim14.model.Room;

public interface RoomDAO {
	public Room save(Room room);
	public List<Room> getRoomsSearch(Integer hotelID, Long arriveDateTS, Long departureDateTS, Boolean twoBeds, Boolean threeBeds, Boolean fourBeds);
	public List<Room> getUnreservedRooms();
	public void removeRoom(Integer id);
	public List<Room> getAllRoomsSearch(String hotelName, String destination, Long start, Long end, boolean twoBeds,
			boolean threeBeds, boolean fourBeds, Double minPrice, Double maxPrice);
}
