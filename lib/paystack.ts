// const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// export async function initializePayment(email: string, amount: number) {
//     if (!PAYSTACK_SECRET_KEY) {
//         console.error('PAYSTACK_SECRET_KEY is missing');
//         throw new Error('Payment configuration error');
//     }

//     if (!process.env.NEXTAUTH_URL) {
//         console.error('NEXTAUTH_URL is missing');
//         throw new Error('NEXTAUTH_URL configuration error');
//     }

//     try {
//         const response = await fetch('https://api.paystack.co/transaction/initialize', {
//             method: 'POST',
//             headers: {
//                 Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email,
//                 amount: Math.round(amount * 100), // Ensure it's an integer
//                 callback_url: `${process.env.NEXTAUTH_URL}/api/paystack/verify`,
//                 metadata: {
//                     custom_fields: [
//                         {
//                             display_name: "Subscription Plan",
//                             variable_name: "plan",
//                             value: "pro"
//                         }
//                     ]
//                 }
//             }),
//         });

//         const data = await response.json();
//         if (!response.ok) {
//             console.error('Paystack API Error Response:', data);
//         }
//         return data;
//     } catch (error) {
//         console.error('Paystack Fetch error:', error);
//         throw error;
//     }
// }

// export async function verifyPayment(reference: string) {
//     try {
//         const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//             },
//         });

//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error('Paystack verification error:', error);
//         throw error;
//     }
// }
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const CALLBACK_URL = 'https://multiai1.netlify.app/api/paystack/verify';

export async function initializePayment(email: string, amount: number) {
    if (!PAYSTACK_SECRET_KEY) {
        console.error('PAYSTACK_SECRET_KEY is missing');
        throw new Error('Payment configuration error');
    }

    try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100), // Convert to kobo
                callback_url: CALLBACK_URL,
                metadata: {
                    custom_fields: [
                        {
                            display_name: 'Subscription Plan',
                            variable_name: 'plan',
                            value: 'pro',
                        },
                    ],
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Paystack API Error Response:', data);
            throw new Error(data?.message || 'Paystack initialization failed');
        }

        return data;
    } catch (error) {
        console.error('Paystack Fetch error:', error);
        throw error;
    }
}

export async function verifyPayment(reference: string) {
    if (!PAYSTACK_SECRET_KEY) {
        console.error('PAYSTACK_SECRET_KEY is missing');
        throw new Error('Payment configuration error');
    }

    try {
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Paystack Verify Error:', data);
            throw new Error(data?.message || 'Paystack verification failed');
        }

        return data;
    } catch (error) {
        console.error('Paystack verification error:', error);
        throw error;
    }
}
