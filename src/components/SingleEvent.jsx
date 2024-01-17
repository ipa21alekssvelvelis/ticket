import React, { useState, useEffect } from 'react';
import PaymentForm from './PaymentForm';

function SingleEvent({onClose, selectedEvent}){
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('token');

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

    const [reviewList, setReviewList] = useState([]);
    useEffect(() => {
        const getEventReviews = async ($id) => {
            try {
                const response = await fetch(`http://localhost/api/review-list-${$id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    console.error('Error:', response.status);
                } else {
                    const eventReviews = await response.json();
                    setReviewList(eventReviews);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        getEventReviews(selectedEvent.id);
    }, []);

    const [ticketList, setTicketList] = useState([]);
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
                    setTicketList(eventTickets);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        getEventTickets(selectedEvent.id);
    }, []);

    const getEventTypeName = (typeId) => {
        const eventType = eventTypes.find((event) => event.id === typeId);
        return eventType ? eventType.type : 'Unknown';
    };
    
    const [priorityError, setPriorityError] = useState(null);
    const [currentRating, setCurrentRating] = useState(1);
    const [rating, setRating] = useState(1);
    const [hoverStar, setHoverStar] = useState(null);
    const handlePriorityChange = (newPriority) => {
        setRating(newPriority);
    };
    const genStar = () => {
        return [...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
                <div className='' key={index}>
                    <label>
                        <input
                            type="radio"
                            className='hidden'
                            name={`rating`}
                            id={`reviewstars`}
                            value={rating}
                            onChange={() => setRating(currentRating)}
                            onClick={() => handlePriorityChange(currentRating)}
                        />
                        <span 
                            className={`text-2xl cursor-pointer ${
                                currentRating <= (hoverStar || rating) ? 'text-yellow-500' : ''
                            }`} 
                            style={{
                                color: currentRating <= (hoverStar || rating) ? "#ffc107" : "#e4e5e9"
                            }}
                            onMouseEnter={() => setHoverStar(currentRating)}
                            onMouseLeave={() => setHoverStar(rating)}
                        >
                            {currentRating <= (hoverStar || rating) ? '★' : '☆'}
                        </span>
                    </label>
                </div>
            );
        });
    };

    const generateReviewStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
            stars.push(<span className='text-yellow-500 text-2xl' key={i}>&#9733;</span>);
            } else {
            stars.push(<span className='text-2xl' key={i}>&#9734;</span>);
            }
        }
        return stars;
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        if (!rating || rating < 1 || rating > 5) {
            setPriorityError("Please provide a valid star rating (1-5).");
            return;
        }

        const formData = new FormData();
        const tokenValue = JSON.parse(token).value

        formData.append('token', tokenValue);
        formData.append('event_id', selectedEvent.id);
        formData.append('user_review', e.target.review.value.trim());
        formData.append('user_rating', rating);

        // console.log(formData.get('user_review'));
        // console.log(formData.get('user_rating'));
        // console.log(formData.get('event_id'));
        const reviewToClear = formData.get('user_review');

        const validationErrors = {};

        if(!reviewToClear){
            validationErrors.review = 'Review is required';
        }

        setErrors(validationErrors);
        setSuccess('');
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch('http://localhost/api/submit-review', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!response.ok) {
                    const responseData = await response.json();
                    setErrors(responseData.error);
                    // console.log(responseData.error);
                } else {
                    setCurrentRating(1);
                    e.target.reset();
                    setSuccess('Review posted');
                    const updatedResponse = await fetch(`http://localhost/api/review-list-${selectedEvent.id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    });

                    if (updatedResponse.ok) {
                        const updatedEventReviews = await updatedResponse.json();
                        setReviewList(updatedEventReviews);
                    }
                }
            } catch (error) {
                console.error('Error submitting review:', error);
            }
        }
    }

    const [isPaymentOpen, setPaymentOpen] = useState(false);

    const handlePaymentClick = () => {
        setPaymentOpen(!isPaymentOpen);
    };
    const handlePaymentClose = () => {
        setPaymentOpen(false);
    };

    return(
        <>
            <div className={`w-screen min-h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300`}></div>
                <div className='w-full flex justify-center items-center align-center fixed top-[51%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30'>
                    <div className='w-[315px] overflow-y-scroll bg-[rgb(24,24,24,1)] h-[650px] text-white sm:w-[75%] md:w-[75%] lg:w-[75%] xl:w-[75%]  min-h-[300px] border-2 border-green-500 z-30  flex flex-col'>
                        <div className='w-full h-full flex flex-col'>
                            <div className='w-full flex flex-col items-center relative'>
                                <div className='absolute top-1.5 right-4 cursor-pointer' onClick={handleClose}>
                                    <span className='text-3xl font-light'>X</span>
                                </div>
                                <h1 className='mt-12 sm:my-8 uppercase font-light text-2xl md:text-4xl lg:text-4xl xl:text-4xl tracking-widest' id='name'>{selectedEvent.name}</h1>
                                
                            </div>
                            <div className='w-full flex flex-col justify-center'>
                                <div className='w-full flex relative sm:flex-row md:flex-row lg:flex-row xl:flex-row flex-col overflow-y-scroll'>
                                    <div className='w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2'>
                                        <div className='w-full mt-12 sm:mt-10 md:mt-10 lg:mt-10 xl:mt-10 justify-center items-center flex flex-col'>
                                            <img
                                                className='hover:scale-105 transition-all duration-300 w-[300px] h-[315px] sm:w-[90%] md:w-[90%] lg:w-[90%] xl:w-[90%] border-2 border-white-500'
                                                src={`http://localhost/storage/images/${selectedEvent.image_path}`}
                                                alt='Uploaded Image'
                                                id='editimage'
                                                name='editimage'
                                            />
                                            <div className='w-4/5 flex justify-center items-center flex flex-col text-center'>
                                                <button className='cursor-pointer ml-4 w-[40%] my-4 focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm uppercase font-light text-3xl tracking-widest' onClick={handlePaymentClick}>Buy</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 justify-center items-center'>
                                    <div className='w-full justify-center md:w-full my-2 flex items-center flex-col sm:items-start'>
                                            <h1 className='ml-4 text-xl uppercase tracking-widest' >Event description</h1>
                                            <div className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg p-1 rounded-sm'>
                                                <p className='ml-2 text-lg tracking-wdiest'>{selectedEvent.description}</p>
                                            </div>
                                        </div>
                                        <div className='w-full my-2 flex items-center flex-col sm:items-start'>
                                            <h1 className='ml-4 text-lg uppercase tracking-widest'>Event type</h1>
                                            <div className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg p-1 rounded-sm'>
                                                <p className='ml-2 text-lg tracking-wdiest'>{getEventTypeName(selectedEvent.type)}</p>
                                            </div>
                                        </div>
                                        <div className='w-full justify-center md:w-full my-2 flex items-center flex-col sm:items-start'>
                                            <h1 className='ml-4 text-lg uppercase tracking-widest'>Event date</h1>
                                            <div className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg p-1 rounded-sm'>
                                                <p className='ml-2 text-lg tracking-wdiest'>{selectedEvent.date}</p>
                                            </div>
                                        </div>
                                        <div className='w-full my-2 flex items-center flex-col sm:items-start'>
                                            <h1 className='ml-4 text-lg uppercase tracking-widest'>Event place</h1>
                                            <div className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg p-1 rounded-sm'>
                                                <p className='ml-2 text-lg tracking-wdiest'>{selectedEvent.place}</p>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <form className='w-full flex flex-col uppercase font-light tracking-widest' onSubmit={handleSubmitForm}>
                                <div className='w-full my-4 mt-6 flex items-center flex-col sm:items-start'>
                                    <div className='w-full items-center flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row'>
                                        <div className='w-[70%] flex sm:justify-start justify-center'>
                                            <h1 className='sm:ml-14 text-lg uppercase tracking-widest'>Your review:</h1>   
                                        </div>
                                        <div className='w-[30%] flex sm:justify-start justify-center'>
                                           <div className='flex'>{genStar()}</div>
                                        </div>
                                    </div>
                                    <div className='w-full flex items-center justify-center'>
                                        <textarea className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' id='review' name='review'/>
                                    </div> 
                                    <div className='w-full flex flex-col items-center justify-around'>
                                        {errors && errors.review && <p className="text-red-500 ml-3 my-2 text-lg">{errors.review}</p>} 
                                       <input className='ml-4 mt-1 w-[35%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm uppercase font-light text-3xl tracking-widest' type='submit' value='Post'/>
                                       {success && <p className="text-green-500 ml-3 my-2 text-lg">{success}</p>} 
                                    </div>
                                </div>
                            </form>
                            <div className='w-full flex justify-center uppercase font-light'>
                                <h1 className='text-4xl sm:text-start text-center'>Reviews from event-goers:</h1>
                            </div>
                            <div className='w-full flex flex-col uppercase font-light tracking-widest'>
                                {reviewList.map((data) => (
                                    <div className='w-full my-4 mt-6 flex items-center flex-col sm:items-start'>
                                        <div className='w-full items-center flex flex-col sm:flex-row md:flex-row lg:flex-row xl:flex-row'>
                                            <div className='w-[70%]'>
                                                <h1 className='sm:ml-16 text-lg uppercase tracking-widest flex'>{data.user.email}</h1>   
                                            </div>
                                            <div className='w-[30%]'>
                                            <div className='flex'>{generateReviewStars(data.rating)}</div> 
                                            </div>
                                        </div>
                                        <div className='w-full flex items-center justify-center'>
                                            <div className='ml-4 w-4/5 sm:w-[90%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg p-1 rounded-sm'>
                                                <p className='ml-2 text-lg tracking-wdiest'>{data.review}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {isPaymentOpen && <PaymentForm onClose={handlePaymentClose} ticketList={ticketList}/>}
                </div>
            </div>
        </>
    );
}

export default SingleEvent;