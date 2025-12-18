'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getAllCategories } from "../features/category/categorySlice";
import Link from "next/link";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import '../componentStyles/Categories.css'

const Categories = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.category);

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        dispatch(getAllCategories());
    }, [dispatch, error]);

    return (
        <>
           
                <div className="category-container">
                    
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        pagination={{
                            clickable: true,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 40,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 50,
                            },
                        }}
                        modules={[Pagination]}
                        className="mySwiper"
                    >
                        {categories &&
                            categories.filter(category => !category.parent).map((category) => (
                                <SwiperSlide key={category._id}>
                                    <Link href={`/products?category=${encodeURIComponent(category.name)}`} className="category-card">
                                        {category.image && category.image[0] && <img src={category.image[0].url} alt={category.name} />}
                                        <p>{category.name}</p>
                                    </Link>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            
        </>
    );
};

export default Categories;