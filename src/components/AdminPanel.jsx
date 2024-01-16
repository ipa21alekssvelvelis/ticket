import React, { useState, useEffect } from 'react';
import CreateOffer from './CreateOffer';
import EditOffer from './EditOffer';
import SingleEvent from './SingleEvent';

function AdminPanel(){
    
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isSingleEventOpen, setSingleEventOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [search, setSearch] = useState('');
    const [events, setEvents] = useState([]);
    const [noMatch, setNoMatch] = useState(false);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const handleInputChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
    
        const filtered = events.filter(
            (event) =>
                event.name.toLowerCase().includes(query) ||
                event.place.toLowerCase().includes(query) ||
                event.price.toLowerCase().includes(query) ||
                event.date.toLowerCase().includes(query) ||
                getEventTypeName(event.type).toLowerCase().includes(query)
                
        );
    
        setFilteredOffers(filtered);
        setNoMatch(filtered.length === 0);
    };

    const handleCreateClick = () => {
        setCreateOpen(!isCreateOpen);
    };
    const handleCloseCreate = () => {
        setCreateOpen(false);
    };
    const handleEditClick = (e,event) => {
        e.stopPropagation();
        setEditOpen(!isEditOpen);
        setSelectedEvent(event);
    };
    const handleCloseEdit = (e) => {
        setEditOpen(false);
        setSelectedEvent(null);
    };
    const handleSingleEventClick = (event) => {
        setSingleEventOpen(!isSingleEventOpen);
        setSelectedEvent(event);
    };
    const handleSingleEventClose = () => {
        setSingleEventOpen(false);
        setSelectedEvent(null);
    };

    const getEvents = async () => {
        try {
            const response = await fetch('http://localhost/api/event-list', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                console.error('Error:', response.status);
            } else {
                const updatedEvents = await response.json();
                // console.log(updatedEvents);
                setEvents(updatedEvents);
                setFilteredOffers(updatedEvents);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getEvents();
    }, []);
    

    const [eventTypes, setEventTypes] = useState([]);
    useEffect(() => {
        const getEventTypes = async () => {
            try {
                const response = await fetch('http://localhost/api/event-types', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    console.error('Error:', response.status);
                } else {
                    const eventTypes = await response.json();
                    // console.log('Event Types:', eventTypes);
                    setEventTypes(eventTypes);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        getEventTypes();
    }, []);

    const handleEventCreated = () => {
        getEvents();
    };
    const handleEventUpdated = () => {
        getEvents();
    };

    const handleDeleteClick = async (eventId, eventName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete event "${eventName}"?`);

        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost/api/event-delete-${eventId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error('Error:', response.status);
                } else {
                    setFilteredOffers((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
                    // console.log('Event deleted successfully');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const getEventTypeName = (typeId) => {
        const eventType = eventTypes.find((event) => event.id === typeId);
        return eventType ? eventType.type : 'Unknown';
    };

    return (
        <>
        <div className="min-h-screen overflow-y-scroll flex flex-col items-center w-full bg-[rgb(18,18,18,0.95)]">
            <div className='w-full mt-[12vh] flex flex-col'>
                <div className="z-10 text-white text-center">
                    <h1 className="text-4xl font-light tracking-[8px] uppercase">Welcome to the Admin Panel</h1>
                    <p className='text-lg mt-2 italic tracking-widest uppercase'>Time to get to work</p>
                </div>
            </div>
            <div className='w-full my-10 flex flex-wrap justify-around text-white flex-col items-center sm:flex-row md:flex-row lg:flex-row xl:flex-row'>
                <button onClick={handleCreateClick} className={`text-3xl font-light tracking-[8px] uppercase transition-all delay-150 hover:border-b-2 ${search && 'border-2'} p-1 border-white hover:scale-105 transform-origin-left`}>Create</button>
                <div className="relative mt-8 sm:mt-6 md:mt-6 lg:mt-6 xl:mt-6 bg-[rgb(18,18,18,0.95)]">
                    <input className={`focus:outline-none bg-[rgb(18,18,18,0.95)] hover:scale-105 focus:scale-105 delay-150 transition-all hover:border-b-2 ${search && 'border-2'} border-white hover:scale-105 text-lg indent-2 p-1 w-full h-12 rounded-sm mb-2`} type='text' id='search' name='search' onChange={handleInputChange} value={search}/>
                    <label
                        htmlFor="search"
                        className={`absolute mt-0 sm:mt-1 md:mt-1 lg:mt-1 xl:mt-1 text-3xl  left-[25px] text-2xl -top-0 bg-[rgb(18,18,18,0.95)]  hover:scale-105 uppercase font-light cursor-text transition-all tracking-[8px]
                        ${search ? '-top-[25px] scale-105 mt-2' : 'left-1 top-1'}`}
                    >
                        Search
                    </label>
                </div>
            </div>
            <div className='w-full h-full my-10 flex flex-wrap flex-grow justify-around text-white items-center sm:flex-row md:flex-row lg:flex-row xl:flex-row'>
            {noMatch && <p className='text-3xl uppercase font-light tracking-widest'>No events match your search</p>}
                {filteredOffers.map((data) => (
                    <div key={data.id} onClick={() => handleSingleEventClick(data)} className={`w-[250px] m-2 cursor-pointer relative text-xl border-2 border-neutral-200 hover:scale-105 transition-all duration-300 h-[400px] flex text-center flex-col uppercase font-light tracking-widest bg-cover bg-center`} id={'event_'+data.id} style={{ backgroundImage: `url(http://localhost/storage/images/${data.image_path})` }}>
                        <div className='w-full h-full flex flex-col items-center relative'>
                            <p className='z-10'>{data.name}</p>
                            <p>{data.date}</p>
                            <p>{data.price} €</p>
                            <p>{getEventTypeName(data.type)}</p>
                            <div className='absolute w-full top-[85%] flex justify-around opacity-100 z-10'>
                                <svg onClick={(e) => handleEditClick(e, data)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <svg onClick={(e) => handleDeleteClick(e, data.id, data.name)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                        </div>
                        <div className='w-full h-full absolute top-0 left-0 bg-[rgb(0,0,0,0.4)] hover:bg-[rgb(0,0,0,0)] transition-all duration-300'></div>
                    </div>
                ))}
            </div>
            {isSingleEventOpen && <SingleEvent onClose={handleSingleEventClose} selectedEvent={selectedEvent}/>}
            {isEditOpen && <EditOffer onClose={handleCloseEdit} selectedEvent={selectedEvent} onEventUpdated={handleEventUpdated}/>}
            {isCreateOpen && <CreateOffer onClose={handleCloseCreate}  onEventCreated={handleEventCreated}/>}
        </div>
        </>
    );
}

export default AdminPanel;