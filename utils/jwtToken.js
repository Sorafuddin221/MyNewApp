export const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    // In Next.js API routes, you can set cookies using the 'cookies' helper.
    // However, for simplicity and to match the original Express logic as much as possible,
    // we'll primarily return the token and let the frontend handle setting it if needed,
    // or set a 'Set-Cookie' header manually if 'next/headers' cookies API is not sufficient.
    // For now, we will return it in the response and also attempt to set it if a `res` object
    // with a `setHeader` method is available (e.g., in a traditional API route handler).

    // Next.js specific way to set cookies using server components or route handlers
    // const cookieOptions = {
    //     httpOnly: true,
    //     expires: new Date(Date.now() + parseInt(process.env.EXPIRE_COOKIE, 10) * 24 * 60 * 60 * 1000),
    //     secure: process.env.NODE_ENV === 'production', // Use secure in production
    //     path: '/',
    // };
    // import { cookies } from 'next/headers';
    // cookies().set('token', token, cookieOptions);


    // For a traditional `res` object as expected by the original function
    // This part might need adjustment depending on how you structure your Next.js API route.
    // In new Next.js App Router API routes, you'd typically use `next/headers` cookies API
    // or return a NextResponse with the 'Set-Cookie' header.
    // For now, mirroring the original logic as closely as possible,
    // assuming `res` will be a NextResponse object.
    
    // The original `sendToken` function directly manipulates the `res` object.
    // In Next.js Route Handlers (app router), you construct a NextResponse and set headers.
    // This utility might need to be re-thought for Next.js.
    // For now, let's just return the user and token. The actual cookie setting will be done
    // in the API route handler directly.

    return {
        success: true,
        user,
        token,
        cookieOptions: {
            expires: new Date(Date.now() + parseInt(process.env.EXPIRE_COOKIE || '7', 10) * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
    };
};