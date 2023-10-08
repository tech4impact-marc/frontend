import React from 'react';

export default function CallbackPage(){
    let code = new URL(window.location.href).searchParams.get('code');
    return(
        <>
            Redirecting..
        </>
    );
}