import { useState, useEffect } from "react";

export const useFetchHotelRooms = (hotelId) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!hotelId) return; 

        const fetchRooms = async () => {
            try {
                const response = await fetch(`https://hms-prod.onrender.com/api/v1/room/get/${hotelId}`);
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setRooms(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [hotelId]); 

    return { rooms, loading, error };
};
