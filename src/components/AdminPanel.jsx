import React, { useState, useEffect } from 'react';


function AdminPanel(){
    const background = {
        backgroundImage: `url(${process.env.PUBLIC_URL}/festival.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    return (
        <>
        <div className="h-screen flex items-center justify-center w-full bg-[rgb(18,18,18,0.95)]">
            <div className="z-10 text-white text-center">
                <h1 className="text-4xl font-light tracking-[8px] uppercase">Welcome to Billetin ™</h1>
                <p className='text-lg mt-2 italic tracking-widest uppercase'>the trendsetters of modern-day ticketing</p>
            </div>
            <div className='w-full h-full absolute top-0 left-0 bg-[rgb(0,0,0,0.6)]'></div>
        </div>
        </>
    );
}

export default AdminPanel;