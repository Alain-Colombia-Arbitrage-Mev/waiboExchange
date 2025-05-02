"use client";

import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Wallbol Exchange</h3>
            <p className="text-sm text-gray-300">
              La manera más rápida y segura de intercambiar dólares por bolivianos
              con las mejores tasas del mercado.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-yellow-400 transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="text-2xl hover:text-yellow-400 transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-2xl hover:text-yellow-400 transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Wallbol Exchange. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 