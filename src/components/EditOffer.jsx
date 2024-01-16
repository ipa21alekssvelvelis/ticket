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
            document.getElementById('price').value = selectedEvent.price;
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

    const handleSubmitForm = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', e.target.name.value.trim());
        formData.append('description', e.target.description.value.trim());
        formData.append('type', e.target.type.value.trim());
        formData.append('date', e.target.date.value.trim());
        formData.append('price', e.target.price.value.trim());
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
        const priceToClear = formData.get('price');
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

        if (!priceToClear) {
            validationErrors.price = 'Event price is required';
        } else if (priceToClear < 0){
            validationErrors.price = 'Events are not free';
        }

        if (!placeToClear) {
            validationErrors.place = 'Event place is required';
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
                    // console.log(response);
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
                <div className='w-full h-[90%] flex flex-col justify-center'>
                        <form className='w-full flex relative sm:flex-row md:flex-row lg:flex-row xl:flex-row flex-col overflow-y-scroll' onSubmit={handleSubmitForm}>
                            <div className='w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 justify-center items-center'>
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
                                    <select className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' id='type' name='type' value={selectedEvent.type}>
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
                                <div className='w-full my-2 flex items-center flex-col sm:items-start'>
                                    <label className='ml-4 text-lg uppercase tracking-widest' htmlFor='price'>Event price</label>
                                    <input className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' type='number' step='0.01' min='1' max='9999' id='price' name='price'/>
                                    {errors.price && <p className="text-red-500 ml-3 my-2 text-lg">{errors.price}</p>}
                                </div>
                            </div>
                            <div className='w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2'>
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
                                            className='cursor-pointer ml-3 my-0 w-4/5 focus:outline-none bg-transparent w-[80%] hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 text-center uppercase tracking-widest my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm'
                                            onClick={handleUpdateImage}
                                        >
                                            {updateImage ? 'Keep Image' : 'Update Image'}
                                        </button>
                                    )}
                                    {updateImage && (
                                        <>
                                            <label
                                                className='cursor-pointer ml-3 my-0 w-4/5 focus:outline-none bg-transparent w-[80%] hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 text-center uppercase tracking-widest my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 w-full h-10 rounded-sm'
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
                        </form>
                    </div>
                    </div>
            </div>
            </div>
        </>
    );
}

export default EditOffer;