'use client';
import React from 'react';
import '../componentStyles/Pagination.css';

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    activeClass = 'active',
    nextPageText = "Next",
    prevPageText = "Prev",
    firstPageText = "1st",
    lastPageText = "Last"
}) {
    if (totalPages <= 1) return null;

    //generate page number
    const getPageNubmers = () => {
        const pageNumbers = [];
        const pageWindow = 2;
        for (let i = Math.max(1, currentPage - pageWindow);
            i <= Math.min(totalPages, currentPage + pageWindow); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    }
    return (
        <div className='pagination'>
            {/*Previous and First Button*/}
            {
                currentPage > 1 && (
                    <>
                        <button className="pagination-btn" onClick={() => onPageChange(1)}>
                            {firstPageText}
                        </button>
                        <button className="pagination-btn" onClick={() => onPageChange(currentPage - 1)}>
                            {prevPageText}
                        </button>
                    </>
                )
            }
            {/*Display Number*/}
            {
                getPageNubmers().map((number) => (
                    <button className={`pagination-btn ${currentPage === number ? activeClass : ''}`} key={number}
                        onClick={() => onPageChange(number)}>{number}</button>
                ))
            }
            {/*Last and Next Button*/}
            {
                currentPage < totalPages && (
                    <>
                        <button className="pagination-btn" onClick={() => onPageChange(currentPage + 1)}>
                            {nextPageText}
                        </button>
                        <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>
                            {lastPageText}
                        </button>
                    </>
                )
            }

        </div>
    )
}

export default Pagination;