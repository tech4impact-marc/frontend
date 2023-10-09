import React from 'react';
import { useRouter } from 'next/router';

export default function KakaoLoginRedirectPage(){
    const postData = {};
    const router = useRouter();

    fetch('http://localhost:3000/auth/kakao/login/done',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            const receivedToken = data.token;
            console.log('Server Response:', receivedToken);

            sessionStorage.setItem('jwtToken', receivedToken);
            router.push('/main')
        })
        .catch((error) => {
            console.error('Error occured:', error);
        })
    
    return(
        <>
            Redirecting..
        </>
    )
}