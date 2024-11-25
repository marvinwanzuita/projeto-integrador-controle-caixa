import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function SignOut() {
  return (
    <div className="signin">
      <div className="signin-container">
        <div className="text-center">
          <p>Agracedemos por usar o <span className="bold-text">Controle de Caixa</span></p>
          <p>Esqueceu algo? <Link to="/" className="dark-link">Entre novamente</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignOut;
