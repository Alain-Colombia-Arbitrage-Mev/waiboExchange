"use client";

import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-blue-800 text-white p-4 shadow-md z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FaExchangeAlt className="text-yellow-400 text-2xl" />
          <h1 className="text-xl md:text-2xl font-bold">Wallbol Exchange</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Inicio
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Contacto
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 