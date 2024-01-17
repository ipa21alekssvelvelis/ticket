import React, { useState, useEffect } from 'react';

function EditOffer({onClose, selectedEvent, onEventUpdated}){
    const [errors, setErrors] = useState({});
    const [updateImage, setUpdateImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
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

    useEffect(() => {
        if (selectedEvent) {
            document.getElementById('name').value = selectedEvent.name;
            document.getElementById('description').value = selectedEvent.description;
            document.getElementById('date').value = selectedEvent.date;
            document.getElementById('place').value = selectedEvent.place;
            if (selectedEvent.image_path) {
                setSelectedFile(null);
                setFileName('');
            } else {
                document.getElementById('image').value = selectedEvent.image_path;
            }
        }
    }, [selectedEvent])

    const handleUpdateImage = (e) => {
        e.preventDefault();
        setUpdateImage(!updateImage);
    };

    const [existingTickets, setExistingTickets] = useState([]);
    const [newTickets, setNewTickets] = useState([{ ticket_name: '', ticket_price: '', quantity: 1 }]);

    useEffect(() => {
        const getEventTickets = async ($id) => {
            try {
                const response = await fetch(`http://localhost/api/ticket-list-${$id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    console.error('Error:', response.status);
                } else {
                    const eventTickets = await response.json();
                    setExistingTickets(eventTickets);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        getEventTickets(selectedEvent.id);
    }, [selectedEvent.id]);

    const handleNewTicketChange = (e, index, property) => {
        const newTicketList = [...newTickets];
        newTicketList[index][property] = e.target.value;
        setNewTickets(newTicketList);
    };

    const addNewTicket = () => {
        setNewTickets([...newTickets, { ticket_name: '', ticket_price: '', quantity: 1 }]);
    };

    const removeNewTicket = (index) => {
        if (newTickets.length > 0) {
            const newTicketList = [...newTickets];
            newTicketList.splice(index, 1);
            setNewTickets(newTicketList);
        }
    };

    const handleExistingTicketChange = (e, index, property) => {
        const updatedExistingTickets = [...existingTickets];
        updatedExistingTickets[index][property] = e.target.value;
        setExistingTickets(updatedExistingTickets);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', e.target.name.value.trim());
        formData.append('description', e.target.description.value.trim());
        formData.append('type', e.target.type.value.trim());
        formData.append('date', e.target.date.value.trim());
        formData.append('place', e.target.place.value.trim());
        if (updateImage && selectedFile) {
            formData.append('image', selectedFile);
        } else if(selectedFile && selectedFile != selectedEvent.image_path){
            formData.append('image', selectedFile);
        }

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

        existingTickets.forEach((ticket, index) => {
            const ticketNameToClear = ticket.ticket_name;
            const ticketPriceToClear = ticket.ticket_price;
            const ticketQuantityToClear = ticket.quantity;

            if (!ticketNameToClear) {
                validationErrors[`existingTicketName${index}`] = 'Existing Ticket name is required';
            }

            if (!ticketPriceToClear) {
                validationErrors[`existingTicketPrice${index}`] = 'Exsiting Ticket price is required';
            } else if (ticketPriceToClear < 1) {
                validationErrors[`existingTicketPrice${index}`] = 'Existing Ticket price must be greater than 0';
            }

            if (!ticketQuantityToClear) {
                validationErrors[`existingTicketQuantity${index}`] = 'Existing Ticket quantity is required';
            } else if (ticketQuantityToClear < 1) {
                validationErrors[`existingTicketQuantiy${index}`] = 'Existing Ticket quantity must be greater than 0';
            }
        });

        newTickets.forEach((ticket, index) => {
            const ticketNameToClear = ticket.ticket_name;
            const ticketPriceToClear = ticket.ticket_price;
            const ticketQuantityToClear = ticket.quantity;

            if (!ticketNameToClear) {
                validationErrors[`newTicketName${index}`] = 'New Ticket name is required';
            }

            if (!ticketPriceToClear) {
                validationErrors[`newTicketPrice${index}`] = 'New Ticket price is required';
            } else if (ticketPriceToClear < 1) {
                validationErrors[`newTicketPrice${index}`] = 'New Ticket price must be greater than 0';
            }

            if (!ticketQuantityToClear) {
                validationErrors[`newTicketQuantity${index}`] = 'New Ticket quantity is required';
            } else if (ticketQuantityToClear < 1) {
                validationErrors[`newTicketQuantiy${index}`] = 'New Ticket quantity must be greater than 0';
            }
        });

        const ticketFormData = new FormData();

        const ticketsData = [
            ...existingTickets.map((ticket) => ({ ...ticket, id: ticket.id })),
            ...newTickets,
        ];

        ticketFormData.append('tickets', JSON.stringify(ticketsData));
        if (ticketFormData.has('tickets')) {
            console.log(`ticket => [ ${ticketFormData.get('tickets')} ]`);
          } else {
            console.log('The key "tickets" does not exist in the FormData object.');
          }
        setErrors(validationErrors);
        setSuccess('');
        if (Object.keys(validationErrors).length === 0) {
            setErrors({});
            // console.log(formData);
            try {
                const response = await fetch(`http://localhost/api/event-update-${selectedEvent.id}`, {
                    method: 'POST',
                    headers: {
                    'X-HTTP-Method-Override': 'PUT',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    console.error('Error:', response.status);
                    const responseData = await response.json();
                    if (responseData.details) {
                        setErrors(responseData.details);
                    }
                } else {
                    
                    try {
                        console.log("Data to be sent:", { tickets: ticketsData })
                        const ticketResponse = await fetch(`http://localhost/api/ticket-update-${selectedEvent.id}`, {
                            method: 'POST',
                            headers: {
                                'X-HTTP-Method-Override': 'PUT',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ tickets: ticketsData }),
                        });
                        if (!ticketResponse.ok) {
                            console.error('Error:', ticketResponse.status);
                            // Handle ticket creation error if needed
                        } else {
                            console.log('pog');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                    setSuccess('Event updated successfully');
                    onEventUpdated();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return(
        <>
        <div className={`w-screen min-h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300`}></div>
        <div className='w-full flex justify-center items-center align-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30'>
            <div className='w-[315px] bg-[rgb(24,24,24,1)] h-[675px] text-white sm:w-[75%] md:w-[75%] lg:w-[75%] xl:w-[75%]  min-h-[300px] border-2 border-green-500 z-30 my-2 flex flex-col'>
                <div className='w-full h-full flex flex-col'>
                <div className='w-full h-[10%] flex flex-col items-center relative'>
                    <h1 className='my-2 uppercase font-light text-2xl md:text-4xl lg:text-4xl xl:text-4xl tracking-widest'>Edit your offer</h1>
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
                                        {existingTickets.map((ticket, index) => (
                                            <div key={`existing-ticket-${index}`} className='w-full my-8 sm:my-6 flex items-center flex-col sm:items-start'>
                                                <label htmlFor={`existingTicketName${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Name
                                                </label>
                                                <input
                                                    type='text'
                                                    id={`existingTicketName${index}`}
                                                    name={`existingTicketName${index}`}
                                                    value={ticket.ticket_name}
                                                    onChange={(e) => handleExistingTicketChange(e, index, 'ticket_name')}
                                                    className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`existingTicketName${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`existingTicketName${index}`]}
                                                    </p>
                                                )}
                                                <label htmlFor={`existingTicketPrice${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Price
                                                </label>
                                                <input
                                                    type='number'
                                                    min='1'
                                                    max='9999'
                                                    step='0.01'
                                                    id={`existingTicketPrice${index}`}
                                                    name={`existingTicketPrice${index}`}
                                                    value={ticket.ticket_price}
                                                    onChange={(e) => handleExistingTicketChange(e, index, 'ticket_price')}
                                                    className='ml-4 my-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`existingTicketPrice${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`existingTicketPrice${index}`]}
                                                    </p>
                                                )}
                                                <label htmlFor={`existingTicketQuantity${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Quantity
                                                </label>
                                                <input
                                                    type='number'
                                                    min='1'
                                                    max='9999'
                                                    step='1'
                                                    id={`existingTicketQuantity${index}`}
                                                    name={`existingTicketQuantity${index}`}
                                                    value={ticket.quantity}
                                                    onChange={(e) => handleExistingTicketChange(e, index, 'quantity')}
                                                    className='ml-4 my-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`existingTicketQuantity${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`existingTicketQuantity${index}`]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                        {newTickets.map((ticket, index) => (
                                            <div key={`new-ticket-${index}`} className='w-full my-8 sm:my-6 flex items-center flex-col sm:items-start'>
                                                <label htmlFor={`newTicketName${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Name
                                                </label>
                                                <input
                                                    type='text'
                                                    id={`newTicketName${index}`}
                                                    name={`newTicketName${index}`}
                                                    value={ticket.ticket_name}
                                                    onChange={(e) => handleNewTicketChange(e, index, 'ticket_name')}
                                                    className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`newTicketName${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`newTicketName${index}`]}
                                                    </p>
                                                )}
                                                <label htmlFor={`newTicketPrice${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Price
                                                </label>
                                                <input
                                                    type='number'
                                                    min='1'
                                                    max='9999'
                                                    step='0.01'
                                                    id={`newTicketPrice${index}`}
                                                    name={`newTicketPrice${index}`}
                                                    value={ticket.ticket_price}
                                                    onChange={(e) => handleNewTicketChange(e, index, 'ticket_price')}
                                                    className='ml-4 my-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`newTicketPrice${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`newTicketPrice${index}`]}
                                                    </p>
                                                )}
                                                <label hhtmlFor={`newTicketQuantity${index}`} className='ml-4 text-lg uppercase tracking-widest'>
                                                    Ticket Quantity
                                                </label>
                                                <input
                                                    type='number'
                                                    min='1'
                                                    max='9999'
                                                    step='1'
                                                    id={`newTicketQuantity${index}`}
                                                    name={`newTicketQuantity${index}`}
                                                    value={ticket.quantity}
                                                    onChange={(e) => handleNewTicketChange(e, index, 'quantity')}
                                                    className='ml-4 my-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                />
                                                {errors[`newTicketQuantity${index}`] && (
                                                    <p className="text-red-500 ml-3 my-2 text-lg">
                                                        {errors[`newTicketQuantity${index}`]}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                        <div className='flex justify-between items-center'>
                                            <button type='button' onClick={addNewTicket} className='text-lg text-white bg-green-500 p-2 m-2 rounded-sm hover:bg-green-600'>
                                                Add Ticket
                                            </button>
                                            <button type='button' onClick={removeNewTicket} className='text-lg text-white bg-red-500 p-2 m-2 rounded-sm hover:bg-red-600'>
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
                                        src={selectedFile ? URL.createObjectURL(selectedFile) : `http://localhost/storage/images/${selectedEvent.image_path}`}
                                        alt='Uploaded Image'
                                        id='editimage'
                                        name='editimage'
                                    />
                                    <h1 className='mt-5 mb-2 text-xl text-center font-light tracking-widest uppercase'>
                                        {fileName || `${selectedEvent.image_path}`}
                                    </h1>
                                    {selectedEvent.image_path && (
                                        <button
                                            className='cursor-pointer ml-3 my-0 focus:outline-none bg-transparent w-[80%] hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 text-center uppercase tracking-widest my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                            onClick={handleUpdateImage}
                                        >
                                            {updateImage ? 'Keep Image' : 'Update Image'}
                                        </button>
                                    )}
                                    {updateImage && (
                                        <>
                                            <label
                                                className='cursor-pointer ml-3 my-0 focus:outline-none bg-transparent w-[80%] hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 text-center uppercase tracking-widest my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                                htmlFor='image'
                                            >
                                                Choose a file
                                            </label>
                                            <input
                                                className='hidden'
                                                type='file'
                                                id='image'
                                                name='image'
                                                accept='image/jpeg, image/png, image/gif, image/jpg'
                                                onChange={handleFileChange}
                                            />
                                            {errors.image && <p className="text-red-500 ml-3 my-2 text-lg">{errors.image}</p>}
                                        </>
                                    )}
                                    <div className='w-4/5 flex justify-center items-center flex flex-col text-center'>
                                    <input className='ml-4 w-4/5 mt-1 focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm uppercase font-light text-3xl tracking-widest' type='submit' value='Edit'/>
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

export default EditOffer;