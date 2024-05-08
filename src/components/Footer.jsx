import React from 'react'
import { footerLinks } from '../constants'

const Footer = () => {
    return (
        <footer className='p-5 sm:px-10'>
            <div className="screen-max-width">
                <div>
                    <p className='text-xs font-bold text-gray'>More ways to shop {' '}
                        <span className='underline text-blue'>
                            Find an apple store {' '}
                        </span>
                        or {' '}
                        <span className='underline text-blue'>
                            other retailer
                        </span>
                        {' '} near you.
                    </p>
                    <p className='text-xs font-bold text-gray'>
                        Or call +425 1239812903812
                    </p>
                </div>
                <div className='w-full h-1 my-5 rounded-full bg-neutral-700' />
                <div className='flex flex-col justify-between md:flex-row md:items-center'>
                    <p className='text-xs font-bold text-gray'>
                        Copyright @ 2024 Apple Inc. All Rights reserved.
                    </p>
                    <div className='flex'>
                        {footerLinks.map((link, i) => (
                        <p key={link} className='text-xs font-semibold text-gray'>
                            {link}
                            {' '}
                            {i !== footerLinks.length - 1 && (<span className='mx-2'> | </span>)}
                        </p>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer