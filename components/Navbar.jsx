'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import  SearchIcon from '@mui/icons-material/Search';
import  ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import  PersonAddIcon from '@mui/icons-material/PersonAdd';
import  CloseIcon from '@mui/icons-material/Close';
import  MenuIcon from '@mui/icons-material/Menu';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';


import '../componentStyles/Navbar.css';
import { useSelector } from 'react-redux';
import UserDashboard from './UserDashboard';
import Loader from './Loader';


function Navbar({ siteLogoUrl, textIcon, isAuthPage }) {
    const [isMenuOpen,setisMenuOpen]=useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery,setSearchQuery]=useState("");
    const toggleMenu=()=>setisMenuOpen(!isMenuOpen);
    const {isAuthenticated, user, loading}=useSelector(state=>state.user || {});
    const {cartItems}=useSelector(state=>state.cart || {cartItems: []});
    const [isClient, setIsClient] = useState(false);

    const [topHeaderVisible, setTopHeaderVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);

    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setTopHeaderVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        if (isAuthPage) {
            setTopHeaderVisible(true); // Always visible on auth pages
            // No scroll listener on auth pages
        } else {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [prevScrollPos, topHeaderVisible, handleScroll, isAuthPage]);


    useEffect(() => {
        setIsClient(true);
    }, []);


    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
      };
      const router=useRouter();
      const handleSearchSubmit=(e)=>{
        e.preventDefault();
        if(searchQuery.trim()){
          router.push( `/products?keyword=${encodeURIComponent(searchQuery.trim())}`)
        }else{
          router.push(`/products`)
        }
        setSearchQuery("")
        setIsSearchOpen(false);
      }
  return (
    <nav className="navbar">
      <div className={`top-header ${!topHeaderVisible ? 'top-header--hidden' : ''}`}>
        <div className="top-header-left">
          <PhoneIcon />
          <span>+1234567890</span>
        </div>
        <div className="top-header-right">
          <EmailIcon />
          <span>test@example.com</span>
        </div>
      </div>
      <div className="main-nav">
        <div className="navbar-container">
            <div className="navbar-logo">
                <Link href='/' onClick={()=>setisMenuOpen(false)}>
                  {siteLogoUrl ? (
                    <Image src={siteLogoUrl} alt="ShopEasy" width={150} height={50} />
                  ) : (
                    textIcon || 'ShopEasy'
                  )}
                </Link>
            </div>
            <div className={`navbar-links ${isMenuOpen?'active':""}`}>
                <ul>
                    <li onClick={()=>setisMenuOpen(false)}><Link href='/'>Home</Link></li>
                    <li><Link href='/products'>products</Link></li>
                    <li><Link href='/about-us'>About Us</Link></li>
                    <li><Link href='/contact'>Contact Us</Link></li>
                    
                </ul>
            </div>
            <div className="navbar-icons">
              <form className={`search-container ${isSearchOpen ? 'active' : ''}`} onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  className='search-input'
                  placeholder='Search Products..'
                  value={searchQuery}
                  onChange={(e)=>setSearchQuery(e.target.value)}
                />
                {isSearchOpen ? (
                  <CloseIcon onClick={toggleSearch} className="search-icon-btn" />
                ) : (
                  <SearchIcon onClick={toggleSearch} className="search-icon-btn"/>
                )}
              </form>
              <div className="cart-container">
                  <Link href="/cart">
                    <ShoppingCartIcon className="icon"/>
                    {isClient && cartItems && <span className="cart-badge">{cartItems.length}</span>}
                  </Link>
              </div>
              {isClient && (
                loading ? <Loader /> : 
                isAuthenticated ? <UserDashboard user={user} /> :
                <div className="register-btn">
                  <Link href="/register" className='register-link'>
                    <PersonAddIcon className="icon" />
                  </Link>
                </div>
              )}
              <div className="navbar-hamburger" onClick={toggleMenu}>
                  {isMenuOpen? <CloseIcon className="icon"/>:<MenuIcon className="icon"/>}
              </div>
            </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;