
import UserModel from '@/models/userModels';
import connectMongoDatabase from '@/lib/db';
import UpdateRoleClient from './UpdateRoleClient'; // Import the client component

export default async function UpdateRolePage({ params }) {
    let userId;
    if (params && typeof params.then === 'function') {
        try {
            const resolvedParams = await params;
            userId = resolvedParams.userId;
        } catch (err) {
            console.error("Error resolving 'params' Promise.", err);
            return <p>Error: Could not resolve user ID for update.</p>;
        }
    } else {
        userId = params.userId;
    }

    let initialUser = null;
    
    if (userId && userId !== 'undefined') {
        try {
            await connectMongoDatabase();
            const userResult = await UserModel.findById(userId).lean();
            if (userResult) {
                initialUser = JSON.parse(JSON.stringify(userResult));
            }
        } catch (error) {
            console.error("Error fetching initial user data in Server Component:", error);
        }
    }

    return <UpdateRoleClient userId={userId} initialUser={initialUser} />;
}