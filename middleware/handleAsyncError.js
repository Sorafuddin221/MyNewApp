// middleware/handleAsyncError.js
import { NextResponse } from 'next/server';

const handleAsyncError = (fn) => async (request, context) => {
    try {
        return await fn(request, context);
    } catch (error) {
        console.error("API Route Error:", error);

        // Customize error response based on error type if needed
        let statusCode = 500;
        let message = "Internal Server Error";

        // Mongoose CastError for invalid ObjectId (e.g., in findById)
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            statusCode = 400;
            message = `Invalid ID provided: ${error.value}`;
        }
        // Mongoose ValidationError (e.g., from model.create or model.save)
        else if (error.name === 'ValidationError') {
            statusCode = 400;
            // Extract messages from validation errors
            message = Object.values(error.errors).map(val => val.message).join(', ');
        }
        // Custom unauthorized message check
        else if (error.message === 'Unauthorized: User not authenticated') {
            statusCode = 401;
            message = error.message;
        }
        // Duplicate key error (MongoDB unique constraint)
        else if (error.code === 11000) {
            statusCode = 400;
            // Extract the field causing the duplicate key error
            const field = Object.keys(error.keyValue)[0];
            message = `Duplicate field value: ${field} already exists.`;
        }
        // General error message fallback
        else {
            message = error.message || message;
        }

        return NextResponse.json({
            success: false,
            message: message,
        }, { status: statusCode });
    }
};

export default handleAsyncError;