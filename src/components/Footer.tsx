import React from 'react'

const Footer = () => {

  return (
    <div>
        <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} LVF_Code - All rights reserved.</p>
            </div>
        </footer>
    </div>
  )
}

export default Footer