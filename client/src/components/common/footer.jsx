import React from "react";

const Footer = () => {
  return (
    <footer className="p-5 bg-cz text-white">
      <div className="row">
        <div className="col-4 ">
          <h3>About</h3>
          <p>Comfort Zone is the facilitating system designed for Airport Housing
			Society, Rawalpindi, Pakistan. Our main focus was to develop a system for the society members so that they can communicate with one another easily.</p>
        </div>
        <div className="col-4">
          <h3>Forum</h3>
          <p>Latest Discussion</p>
        </div>
        <div className="col-4">
          <h3>Contact us</h3>
          <p>
            <i class="fa fa-map-marker" aria-hidden="true"></i> Airport Housing Society <br/>Rawalpindi, Punjab<br/>
            <i class="fa fa-phone" aria-hidden="true"></i> +92-335-2522522<br/>
            <i class="fa fa-envelope" aria-hidden="true"></i> admin@comfortzone.pk
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
