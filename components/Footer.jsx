'use client';
import React from 'react';
import {Phone,Mail, GitHub, LinkedIn, YouTube, Instagram} from '@mui/icons-material';
import '../componentStyles/Footer.css';
import Link from 'next/link';

function Footer() {
  return (
    <footer className='footer'>
      <div className="footer-container">
        {/*section 1*/}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p><Phone fontSize='small'/> phone: 0177777777</p>
          <p><Mail fontSize='small'/>Email: mdsorafuddin@gmail.com</p>
        </div>
        {/*section 2*/}
        <div className="footer-section social">
          <h3>Follow Me</h3>
          <div className="social-links">
            <a href="http://" target='_blank'>
            <GitHub className='social-icon'/>
            </a>
            <a href="http://" target='_blank'>
            <LinkedIn className='social-icon'/>
            </a>
            <a href="http://" target='_blank'>
            <YouTube className='social-icon'/>
            </a>
            <a href="http://" target='_blank'>
            <Instagram className='social-icon'/>
            </a>
          </div>
        </div>
        {/*section 3*/}
        <div className="footer-section footer-menu">
          <h3 className='footer-menu-title'>Footer Menu</h3>
          <ul className='footer-menu-items'>
            <li ><Link className='footer-menu-item' href="/about-us">About Us</Link></li>
            <li ><Link className='footer-menu-item' href="/contact">Contact Us</Link></li>
            <li ><Link className='footer-menu-item' href="/privacy-policy">Privacy Policy</Link></li>
            <li ><Link className='footer-menu-item' href="/terms-and-conditions">Terms & Conditions</Link></li>
          </ul>
        </div>
        {/*section 4*/}
        <div className="footer-section about">
          <h3>About</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, facere?</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 sorafcoding all right resered </p>
      </div>
    </footer>
  )
}

export default Footer;