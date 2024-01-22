import React from 'react';

function PaymentSuccessPopup({ onClose }) {
  return (
    <div className='w-full h-full fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-40 z-40'>
      <div className='w-[250px] bg-[rgb(24,24,24,1)] min-h-[200px] text-white border-2 border-green-500 z-30 my-2 flex flex-col text-center items-center p-8'>
        <h1 className='text-2xl font-light'>Thank you for your purchase!</h1>
        <button
          className='mt-4 p-2 bg-green-500 text-white rounded cursor-pointer'
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessPopup;