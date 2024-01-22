import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { toDataURL } from 'qrcode';
import QRCode from 'qrcode.react';
import SingleEvent from './SingleEvent';
function PurchaseHistory(){

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isSingleEventOpen, setSingleEventOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [events, setEvents] = useState([]);
    const [noMatch, setNoMatch] = useState(false);
    const [filteredOffers, setFilteredOffers] = useState([]);

    const getEventTypeName = (typeId) => {
        const eventType = eventTypes.find((event) => event.id === typeId);
        return eventType ? eventType.type : 'Unknown';
    };

    const localToken = localStorage.getItem('token');
    const tokenValue = JSON.parse(localToken).value

    const handleInputChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
    
        const filtered = soldTickets.filter((event) => {
            const eventName = (event.name || '').toLowerCase();
            const eventPlace = (event.place || '').toLowerCase();
            const eventPrice = (event.price || '').toLowerCase();
            const eventDate = (event.date || '').toLowerCase();
            const eventTypeName = (getEventTypeName(event.type) || '').toLowerCase();
    
            return (
                eventName.includes(query) ||
                eventPlace.includes(query) ||
                eventPrice.includes(query) ||
                eventDate.includes(query) ||
                eventTypeName.includes(query)
            );
        });
    
        setFilteredOffers(filtered);
        setNoMatch(filtered.length === 0);
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

    

    const [soldTickets, setSoldTickets] = useState([]);
        const getSoldTickets = async () => {
            // console.log(tokenValue);
            // console.log(localToken)
            try {
                const response = await fetch(`http://localhost/api/get-user-tickets-${1}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${tokenValue}`,
                    },
                });

                if (!response.ok) {
                    console.error('Error:', response.status);
                } else {
                    const soldTickets = await response.json();
                    console.log('i dont know man:', soldTickets.data);
                    setSoldTickets(soldTickets.data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

    useEffect(() => {
        getSoldTickets();
    }, []);
    console.log(soldTickets);

    const handleSingleEventClick = (event) => {
        setSingleEventOpen(!isSingleEventOpen);
        setSelectedEvent(event);
    };
    const handleSingleEventClose = () => {
        setSingleEventOpen(false);
        setSelectedEvent(null);
    };

    const generateTicketPDF = async (ticket) => {
        // Create a new instance of jsPDF
        const pdf = new jsPDF();
        pdf.setFont("utf-8");
        pdf.setFontSize(20);
    
        // Add content to the PDF
        pdf.text(`Event Name: ${ticket.event.name}`, 60, 40);
        pdf.text(`Date: ${ticket.event.date}`, 60, 50);
        pdf.text(`Event Type: ${getEventTypeName(ticket.event.type)}`, 60, 60);
        pdf.text(`Ticket Name: ${ticket.ticket.ticket_name}`, 60, 70);
        pdf.text(`Ticket Price: ${ticket.ticket.ticket_price*ticket.quantity} €`, 60, 80);
        pdf.text(`Quantity: ${ticket.quantity}`, 60, 90);

        const ticketIdString = ticket.ticket.id.toString();
    
        // Generate QR code for ticket.id using qrcode library directly
        const qrCodeDataUrl = await toDataURL(ticketIdString);
        pdf.addImage(qrCodeDataUrl, 'JPEG', 40, 150, 130, 130);
    
        // const imagePath = `http://localhost/storage/images/${ticket.event.image_path}.png`;
        // pdf.addImage(imagePath, 'PNG', 50, 120, 45, 45);
        // Save or display the PDF
        pdf.save(`ticket-${ticket.event.name}-${ticket.ticket.id}.pdf`);
        
    };
    

    return(
        <>
        <div className="min-h-screen overflow-y-scroll flex flex-col items-center w-full bg-[rgb(18,18,18,0.95)]">
            <div className='w-full mt-[12vh] flex flex-col'>
                <div className="z-10 text-white text-center">
                    <h1 className="text-4xl font-light tracking-[8px] uppercase">YOUR PURCHASES</h1>
                    <p className='text-lg mt-2 italic tracking-widest uppercase'>You have tickets for these events</p>
                </div>
            </div>
            <div className='w-full my-10 flex flex-wrap justify-around text-white flex-col items-center'>
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
                <h1 className='font-light tracking-widest'>enter anything - price, date, genre</h1>
            </div>
            <div className='w-full h-full relative my-10 flex flex-wrap flex-grow justify-around text-white items-center sm:flex-row md:flex-row lg:flex-row xl:flex-row'>
            {noMatch && <p className='text-3xl uppercase font-light tracking-widest'>No events match your search</p>}
                {soldTickets.map((ticket) => (
                    <div key={ticket.event.id} onClick={() => handleSingleEventClick(ticket.event)} className={`w-[250px] m-2 cursor-pointer relative text-xl border-2 border-neutral-200 hover:scale-105 transition-all duration-300 h-[400px] flex text-center flex-col uppercase font-light tracking-widest bg-cover bg-center`} id={'event_'+ticket.event.id} style={{ backgroundImage: `url(http://localhost/storage/images/${ticket.event.image_path})` }}>
                        <div className='w-full h-full flex flex-col items-center relative'>
                            <p className='z-10'>{ticket.event.name}</p>
                            <p>{ticket.event.date}</p>
                            <p>{getEventTypeName(ticket.event.type)}</p>
                            <p>Your ticket:</p>
                            <div className='w-full my-6 absolute bottom-0 items-center flex justify-center text-center flex-col'>
                                <p className=''>{ticket.ticket.ticket_name}</p>
                                <p className=''>{ticket.ticket.ticket_price} €</p>
                                <p className='mb-2'>{'Quantity: '+ticket.quantity}</p>
                                <button
                                    className="absolute w-full uppercase tracking-widest top-[85%] flex justify-around opacity-100 z-10"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Stop the click event from propagating
                                        generateTicketPDF(ticket);
                                    }}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                        <div className='w-full h-full absolute top-0 left-0 bg-[rgb(0,0,0,0.4)] hover:bg-[rgb(0,0,0,0)] transition-all duration-300'></div>
                    </div>
                ))}
            </div>
            {isSingleEventOpen && <SingleEvent onClose={handleSingleEventClose} selectedEvent={selectedEvent}/>}
        </div>
        </>
    );
}



export default PurchaseHistory;