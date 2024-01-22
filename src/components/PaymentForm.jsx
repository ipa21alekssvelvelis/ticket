import {loadStripe} from '@stripe/stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PaymentSuccessPopup from './PaymentSuccessPopup';
import React, { useState, useEffect } from 'react';

const stripePromise = loadStripe('pk_test_51OZJj9CRXpjVDtSaA8I4Q1qJHqiGgSw9L85M4CV0bG3ZJCE6e20cMzrYgEhqXn60tKh1BYjeHiHOGzB212mOuR2U00IxFyX068');

function PaymentForm({onClose, ticketList}){
    const [errors, setErrors] = useState({});
    const [selectedTicket, setSelectedTicket] = useState(ticketList.length > 0 ? ticketList[0].id : null);
    const [ticketQuantity, setTicketQuantity] = useState(ticketList.length > 0 ? ticketList[0].quantity : null);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [cardError, setCardError] = useState(null);

    const localToken = localStorage.getItem('token');
    const tokenValue = JSON.parse(localToken).value
    // console.log(ticketList);
    useEffect(() => {
        if (ticketList.length > 0) {
          setSelectedTicket(ticketList[0].id);
          setTicketQuantity(ticketList[0].quantity);
        }
    }, [ticketList]);

    const handleClose = () => {
        onClose();
    };

    const stripe = useStripe();
    const elements = useElements();

    const handleSelectedTicketChange = (selectedTicketId) => {
        setSelectedTicket(selectedTicketId);
    
        const selectedTicketData = ticketList.find(ticket => ticket.id === parseInt(selectedTicketId));
        setTicketQuantity(selectedTicketData ? selectedTicketData.quantity : null);
    };

    const handleCardSubmit = async (e) => {
        e.preventDefault();

        const cardElement = elements.getElement(CardElement);

        const { token, error } = await stripe.createToken(cardElement);

        const validationErrors = {};

        if (error) {
            // console.error(error);
            if (error.code === 'incomplete_number') {
              validationErrors.cardNumber = 'Your card number is incomplete.';
              setCardError('Your card number is incomplete.');
            } else if (error.code === 'invalid_number') {
              validationErrors.cardNumber = 'Invalid card number.';
              setCardError('Invalid card number.');
            } else if (error.code === 'invalid_expiry_past_year') {
                validationErrors.cardNumber = 'Expired card.';
                setCardError('Expired card.');
             } else if (error.code === 'incomplete_cvc') {
                validationErrors.cardNumber = 'Incomplete CVC.';
                setCardError('Incomplete CVC.');
            }
        }
    
        const formData = new FormData();
        formData.append('name', e.target.name ? e.target.name.value.trim() : '');
        formData.append('quantity', e.target.quantity ? e.target.quantity.value.trim() : '');
        
        const nameToClear = formData.get('name');
        const quantityToClear = formData.get('quantity');

        if (!nameToClear.trim()) {
            validationErrors.name = 'Name is required';
        }

        if (!quantityToClear.trim()) {
            validationErrors.quantity = 'Quantity is required';
        } else if (quantityToClear < 0){
            validationErrors.quantity = 'Quantity cannot be below 0'
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                if (!Array.isArray(ticketList) || ticketList.length === 0) {
                    console.error('Ticket List is not a valid array.');
                    return;
                }
                const selectedTicketData = ticketList.find(ticket => ticket.id === parseInt(selectedTicket));
                console.log(selectedTicketData);
                console.log(quantityToClear);
                const response = await fetch('http://localhost/api/pay-for-ticket', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenValue}`
                    },
                    body: JSON.stringify({
                        amount: parseFloat(selectedTicketData.ticket_price),
                        ticket_id: selectedTicketData.id,
                        event_id: selectedTicketData.event_id,
                        token: token,
                        user_token: tokenValue,
                        quantity: quantityToClear,
                    }),
                });
                if(response.ok){
                    setPaymentSuccessful(true);
                } else {
                    console.error('Payment failed');
                    setPaymentError('Payment failed. Please try again.');
                }
            } catch (error) {
                console.error('Error during payment:', error.message);
                setPaymentError('An unexpected error occurred. Please try again.');
              }
        }
    };
    
    
    return(
        <>
        <div className={`w-screen min-h-screen fixed top-0 left-0 bg-black bg-opacity-40 z-20 transition-opacity duration-300`}></div>
        <div className='w-full flex justify-center items-center align-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30'>
            <div className='w-[315px] sm:w-[70%] bg-[rgb(24,24,24,1)] min-h-[300px] text-white border-2 border-green-500 z-30 my-2 flex flex-col'>
                <div className='w-full h-full flex flex-col'>
                    <div className='w-full h-[10%] flex flex-col items-center relative'>
                        <h1 className='my-8 sm:my-1 uppercase font-light text-center text-2xl md:text-4xl lg:text-4xl xl:text-4xl tracking-widest'>Pay for your ticket</h1>
                        <p className='my-8 sm:my-1 uppercase font-light text-xl sm:text-2xl tracking-widest'>Enter your details</p>
                        <div className='absolute top-1.5 right-4 cursor-pointer' onClick={handleClose}>
                            <span className='text-3xl font-light'>X</span>
                        </div>
                    </div>
                    <form className='w-full flex flex-col items-center' onSubmit={handleCardSubmit}>
                        <div className="w-[80%] flex flex-col mt-12 sm:mt-10 items-center rounded-sm sm:items-start">
                            <label className="ml-4 text-lg uppercase tracking-widest" htmlFor="selectedTicket">
                                Select a Ticket
                            </label>
                            <select
                                className="ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm"
                                id="selectedTicket"
                                name="selectedTicket"
                                value={selectedTicket}
                                onChange={(e) => handleSelectedTicketChange(e.target.value)}
                            >
                                {ticketList.map((ticket) => {
                                    if (ticket.quantity > 0) {
                                        return (
                                            <option key={ticket.id} value={ticket.id}>
                                                {ticket.ticket_name} - ${ticket.ticket_price}
                                            </option>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </select>
                            {errors.selectedTicket && (
                                <p className="text-red-500 ml-3 my-2 text-lg">{errors.selectedTicket}</p>
                            )}
                        </div>
                        <div className='w-[80%] flex mt-12 sm:mt-10 items-center rounded-sm flex-col sm:items-start'>
                            <label className='ml-4 text-lg uppercase tracking-widest' htmlFor='name'>Name and surname</label>
                            <input className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm' type='text' id='name' name='name'/>
                            {errors.name && <p className="text-red-500 ml-3 my-2 text-lg">{errors.name}</p>}
                        </div>
                        <div className='w-[80%] flex mt-12 sm:mt-10 items-center rounded-sm flex-col sm:items-start'>
                            <label className='ml-4 text-lg uppercase tracking-widest' htmlFor='quantity'>{`Ticket Quantity (Available: ${ticketQuantity})`}</label>
                            <input
                                className='ml-4 w-4/5 sm:w-[95%] md:w-[95%] lg:w-[95%] xl:w-[95%] focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm'
                                type='number'
                                min='1'
                                step='1'
                                max={ticketQuantity || 0}
                                id='quantity'
                                name='quantity'
                            />
                            {errors.quantity && <p className="text-red-500 ml-3 my-2 text-lg">{errors.quantity}</p>}
                        </div>
                        <div className='w-[80%] flex mt-12 sm:mt-10 items-center rounded-sm flex-col sm:items-start'>
                            <div className='w-full'>
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            border: '1px solid white',
                                            width: '100%',
                                            fontSize: '24px',
                                            color: '#ffffff',
                                            '::placeholder': {
                                                color: '#ffffff',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }}
                            />
                            {cardError && (
                                <p className="text-red-500 ml-3 my-2 text-lg">{cardError}</p>
                            )}
                            {paymentError && (
                                <p className="text-red-500 ml-3 my-2 text-lg">{paymentError}</p>
                            )}
                            </div>
                        </div>
                        <div className='w-full flex justify-center items-center'>
                            <input className='cursor-pointer ml-4 w-[40%] my-4 focus:outline-none bg-transparent hover:scale-105 focus:scale-105 hover:border-neutral-200 focus:border-neutral-200 my-2 focus:border-2 duration-150 border border-neutral-600 text-lg indent-2 p-1 h-10 rounded-sm uppercase font-light text-3xl tracking-widest' type='submit' value='Pay'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {paymentSuccessful && (
            <PaymentSuccessPopup onClose={() => { setPaymentSuccessful(false); onClose(); }} />
        )}
        </>
    );
}

export default PaymentForm;