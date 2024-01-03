import React, { useState, useEffect } from 'react';
import '../App.css'; 
function Bdc() {


   
  return (
    <>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    <title>DataTables </title>
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <link
      href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel=" stylesheet"
    />
    {/*Replace with your tailwind.css once created*/}
    {/*Regular Datatables CSS*/}
    <link
      href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"
      rel="stylesheet"
    />
    <link
    href="//netdna.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"
    rel="stylesheet"
    id="bootstrap-css"
  />
    {/*Responsive Extension Datatables CSS*/}
    <link
      href="https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css"
      rel="stylesheet"
    />
    <div  style={{ margin: '30px' }}>
    <h1> Test Bons de Commandes </h1>

</div>
   
    
  </>
  

)
}
export default Bdc;