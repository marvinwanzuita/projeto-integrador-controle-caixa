// SidebarNav.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHome, faWallet, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import './SidebarNav.css';

function SidebarNav() {
  return (
    <Nav className="flex-column fixed">
      <Link className='logo-img' to="/">
        Controle de Caixa
      </Link>
      <Nav.Link as={Link} to="/"><FontAwesomeIcon icon={faHome} className="nav-icon"/> Painel </Nav.Link>
      <Nav.Link as={Link} to="/incomes"><FontAwesomeIcon icon={faDollarSign} className="nav-icon" /> Entradas </Nav.Link>
      <Nav.Link as={Link} to="/expenses"><FontAwesomeIcon icon={faWallet} className="nav-icon" /> Saídas </Nav.Link>
      {/* Exit Link */}
      {/* <Nav.Link as={Link} to="/signout" className="exit-link">
       Sair
      </Nav.Link> */}
      
    </Nav>
  );
}

export default SidebarNav;
