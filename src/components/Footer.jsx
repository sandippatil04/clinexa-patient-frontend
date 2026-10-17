import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*------------left section------------ */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Our Doctor Appointment Booking System helps patients easily find doctors and book appointments online without waiting in long queues. This system saves time, reduces paperwork, and makes hospital management more efficient.</p>
            </div>

            {/*------------center section------------ */}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>

            {/*------------right section------------ */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+0-000-000-0000</li>
                    <li>mrsandip415@gmail.com</li>
                </ul>
            </div>
        </div>

        {/*-------copyright text------- */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2026 @Clinexa - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer