import React, { useState, useEffect } from 'react';

function CreateOffer({onClose, onEventCreated}){
    const [errors, setErrors] = useState({});
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [fileName, setFileName] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setFileName(file ? file.name : '');
    };

    const handleClose = () => {
        onClose();
    };

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

    const handleSubmitForm = async (e) => {
        e.preventDefault();

    
        const formData = new FormData();
        formData.append('name', e.target.name ? e.target.name.value.trim() : '');
        formData.append('description', e.target.description ? e.target.description.value.trim() : '');
        formData.append('type', e.target.type ? e.target.type.value.trim() : '');
        formData.append('date', e.target.date ? e.target.date.value.trim() : '');
        formData.append('place', e.target.place ? e.target.place.value.trim() : '');
        formData.append('image', selectedFile);

        const validationErrors = {};

        const nameToClear = formData.get('name');
        const descToClear = formData.get('description');
        const typeToClear = formData.get('type');
        const dateToClear = formData.get('date');
        const placeToClear = formData.get('place');
        const imageToClear = formData.get('image');

        if (!nameToClear) {
            validationErrors.name = 'Event name is required';
        }   

        if (!descToClear) {
            validationErrors.desc = 'Description is required';
        }

        if (!typeToClear) {
            validationErrors.type = 'Event type is required';
        }

        if (!dateToClear) {
            validationErrors.date = 'Event date is required';
        } else {
            const currentDate = new Date();
            const selectedDate = new Date(dateToClear);

            if (selectedDate < currentDate) {
                validationErrors.date = 'Date cannot be in the past';
            }
        }

        if (!placeToClear) {
            validationErrors.place = 'Event place is required';
        }

        if (!imageToClear) {
            validationErrors.image = 'Event banner is required';
        }

        tickets.forEach((ticket, index) => {
            const ticketNameToClear = ticket.name;
            const ticketPriceToClear = ticket.price;
            const ticketQuantityToClear = ticket.quantity;
    
            if (!ticketNameToClear) {
                validationErrors[`ticketName${index}`] = 'Ticket name is required';
            }
    
            if (!ticketPriceToClear) {
                validationErrors[`ticketPrice${index}`] = 'Ticket price is required';
            } else if (ticketPriceToClear < 1) {
                validationErrors[`ticketPrice${index}`] = 'Ticket price must be greater than 0';
            }
            if (!ticketQuantityToClear) {
                validationErrors[`ticketQuantity${index}`] = 'Ticket quantity is required';
            } else if (ticketQuantityToClear < 1) {
                validationErrors[`ticketQuantiy${index}`] = 'Ticket quantity must be greater than 0';
            }
        });

        const ticketsData = tickets.map((ticket) => ({
            name: ticket.name,
            price: ticket.price,
            quantity: ticket.quantity,
        }));
        // console.log(ticketsData);
        formData.append('tickets', JSON.stringify(ticketsData));
        // console.log(formData.get('tickets'));
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setErrors({});
            console.log(formData.get('name'));

            try {
                const response = await fetch('http://localhost/api/event-store', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    console.error('Error:', response.status);
                    const responseData = await response.json();
                    if (responseData.details) {
                        setErrors(responseData.details);
                    }
                } else {
                    const eventResponse = await response.json();
                    const eventId = eventResponse.event_id;
                    console.log(eventId);
                    const ticketsData = tickets.map((ticket) => ({
                        ...ticket,
                        event_id: eventId,
                    }));

        
                    // Fetch to create tickets
                    const ticketsResponse = await fetch('http://localhost/api/tickets-store', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ tickets: ticketsData }),
                    });
        
                    if (!ticketsResponse.ok) {
                        console.error('Error:', ticketsResponse.status);
                        // Handle ticket creation error if needed
                    } else {

                    }
        
                    setSuccess('Event and tickets created successfully');
                    onEventCreated();
                }        
            } catch (error) {
                console.error('Error:', error);
                // Handle fetch error here
            }
        }
    };
    const [tickets, setTickets] = useState([
        { name: '', price: '', quantity: 1 },
    ]);
    
    const handleTicketChange = (e, index, property) => {
        const newTickets = [...tickets];
        newTickets[index][property] = e.target.value;
        setTickets(newTickets);
    };
    
    const addTicket = () => {
        setTickets([...tickets, { name: '', price: '', quantity: 1 }]);
    };
    
    const removeTicket = () => {
        if (tickets.length > 1) {
            const newTickets = [...tickets];
            newTickets.pop();
            setTickets(newTickets);
        }
    };
    
    return(
        <>
        <div className={`w-screen min-h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300`}></div>
        <div className='w-full flex justify-center items-center align-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30'>
            <div className='w-[315px] bg-[rgb(24,24,24,1)] h-[675px] text-white sm:w-[75%] md:w-[75%] lg:w-[75%] xl:w-[75%]  min-h-[300px] border-2 border-green-500 z-30 my-2 flex flex-col'>
                <div className='w-full h-full flex flex-col'>
                    <div className='w-full h-[10%] flex flex-col items-center relative'>
                        <h1 className='my-8 sm:my-1 uppercase font-light text-2xl md:text-4xl lg:text-4xl xl:text-4xl tracking-widest'>Create your offer</h1>
                        <div className='absolute top-1.5 right-4 cursor-pointer' onClick={handleClose}>
                            <span className='text-3xl font-light'>X</span>
                        </div>
                    </div>
                    <form className='w-full h-[90%] flex flex-col justify-center' onSubmit={handleSubmitForm}>
                        <div className='w-full flex relative flex-col overflow-y-scroll'>
                            <div className='w-full flex flex-col sm:flex-row'>
                                <div className='w-full sm:w-1/2 flex flex-col'>
                                <div className='w-full sm:w-[90%] justify-center items-center'>
                                    <div className='w-full flex mt-8 sm:mt-6 md:mt-6 lg:mt-6 xl:mt-6 items-center flex-col sm:items-start'>
                                        <label className='ml-4 text-lg uppercase tracking-widest' htmlFor='loginEmail'>Event name</label>
                                        <input className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' type='text' id='name' name='name'/>
                                        {errors.name && <p className="text-red-500 ml-3 my-2 text-lg">{errors.name}</p>}
                                    </div>
                                    <div className='w-full my-2 flex items-center flex-col sm:items-start'>
                                        <label className='ml-4 text-lg uppercase tracking-widest' htmlFor='loginEmail'>Event description</label>
                                        <textarea className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' id='description' name='description'></textarea>
                                        {errors.desc && <p className="text-red-500 ml-3 my-2 text-lg">{errors.desc}</p>}
                                    </div>
                                    <div className='w-full my-2 flex items-center flex-col sm:items-start'>
                                        <label className='ml-4 text-lg uppercase tracking-widest' htmlFor='price'>Event type</label>
                                        <select className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' id='type' name='type'>
                                        {eventTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                            {type.type}
                                            </option>
                                        ))}
                                        </select>
                                        {errors.type && <p className="text-red-500 ml-3 my-2 text-lg">{errors.type}</p>}
                                    </div>
                                    <div className='w-full justify-center md:w-full my-2 flex items-center flex-col sm:items-start'>
                                        <label className='ml-4 text-lg uppercase tracking-widest' htmlFor='date'>Event date</label>
                                        <input className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' type='datetime-local' id='date' name='date'/>
                                        {errors.date && <p className="text-red-500 ml-3 my-2 text-lg">{errors.date}</p>}
                                    </div>
                                    <div className='w-full my-2 flex items-center flex-col sm:items-start'>
                                        <label className='ml-4 text-lg uppercase tracking-widest' htmlFor='place'>Event place</label>
                                        <input className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' type='text' id='place' name='place'/>
                                        {errors.place && <p className="text-red-500 ml-3 my-2 text-lg">{errors.place}</p>}
                                    </div>
                                </div>
                                </div>
                                <div className='w-full sm:w-1/2 flex flex-col'>
                                    <div className='w-full'>
                                        {tickets.map((ticket, index) => (
                                            <div key={`ticket-${index}`} className='w-full my-8 sm:my-6 flex items-center flex-col sm:items-start'>
                                                <label htmlFor={`ticketName${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Name
                                                </label>
                                                <input
                                                    type='text'
                                                    id={`ticketName${index}`}
                                                    name={`ticketName${index}`}
                                                    value={ticket.name}
                                                    onChange={(e) => handleTicketChange(e, index, 'name')}
                                                    className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`ticketName${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`ticketName${index}`]}
                                                    </p>
                                                )}
                                                <label htmlFor={`ticketPrice${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Price
                                                </label>
                                                <input
                                                    type='number'
                                                    min='1'
                                                    max='9999'
                                                    step='0.01'
                                                    id={`ticketPrice${index}`}
                                                    name={`ticketPrice${index}`}
                                                    value={ticket.price}
                                                    onChange={(e) => handleTicketChange(e, index, 'price')}
                                                    className='ml-4 my-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`ticketPrice${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`ticketPrice${index}`]}
                                                    </p>
                                                )}
                                                <label htmlFor={`ticketQuantity${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Quantity
                                                </label>
                                                <input
                                                    type='number'
                                                    min='1'
                                                    max='9999'
                                                    step='1'
                                                    id={`ticketQuantity${index}`}
                                                    name={`ticketQuantity${index}`}
                                                    value={ticket.quantity}
                                                    onChange={(e) => handleTicketChange(e, index, 'quantity')}
                                                    className='ml-4 my-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`ticketQuantity${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`ticketQuantity${index}`]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                        <div className='flex justify-between items-center'>
                                            <button type='button' onClick={addTicket} className='text-lg text-white bg-green-500 p-2 m-2 rounded-sm hover:bg-green-600'>
                                                Add Ticket
                                            </button>
                                            <button type='button' onClick={removeTicket} className='text-lg text-white bg-red-500 p-2 m-2 rounded-sm hover:bg-red-600'>
                                                Remove Ticket
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className='w-full'>
                                    <div className='w-full mt-12 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 justify-center items-center flex flex-col'>
                                        <img
                                            className='hover:scale-105 transition-all duration-300 w-[300px] h-[315px] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[90%] border-2 border-white-500'
                                            src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                                            alt='Uploaded Image'
                                        />
                                            <h1 className='my-4 text-xl text-center font-light tracking-widest uppercase'>
                                            {fileName || 'No file selected'}
                                        </h1>
                                        <label
                                            className='cursor-pointer ml-3 my-0 w-4/5 focus:outline-none bg-transparent w-[80%] hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 text-center uppercase tracking-widest my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                            htmlFor='image'
                                        >
                                        Choose a file
                                        </label>
                                        <input
                                            className='hidden'
                                            type='file'
                                            id='image'
                                            name='image'
                                            accept='image/jpeg, image/png, image/gif'
                                            onChange={handleFileChange}
                                        />
                                            {errors.image && <p className="text-red-500 ml-3 my-2 text-lg">{errors.image}</p>}
                                        <div className='w-4/5 mt-10 flex justify-center items-center flex flex-col text-center'>
                                            <input className='ml-4 w-4/5 mt-1 focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm uppercase font-light text-3xl tracking-widest' type='submit' value='Create'/>
                                            {success && <p className="text-green-500 ml-3 text-lg">{success}</p>}
                                        </div>
                                    </div>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>



    );
}

export default CreateOffer;