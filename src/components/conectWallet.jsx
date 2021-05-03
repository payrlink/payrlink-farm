import React from "react";
import { Button, Modal } from "react-bootstrap";
import ExcMark from "../assets/exclamation.svg";
import ExcMarkWhite from "../assets/exclamation-white.svg";
import Metamask from "../assets/metamask.svg";
import MetamaskDark from "../assets/metamask-dark.svg";
import WConnect from "../assets/wallet-Connect.svg";
import WConnectDark from "../assets/wallet-Connect-dark.svg";

function ConectWallet(props) {
  return (
    <Modal
      {...props}
      // size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={`${
        props.themeClass
          ? "custome_normal_modal_light"
          : "custome_normal_modal_dark"
      }`}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="text-center text-white font-weight-bold"
        >
          Connect Wallet
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <div className="d-flex">
          <img
            src={props.themeClass ? ExcMark : ExcMarkWhite}
            className="mr-3"
          />
          <p className="mb-0 ">
            You are about to input highly sensitive information, please DO NOT
            expose to strangers.
          </p>
        </div>
        <div className="px-4">
          <Button
            variant="light"
            className="mx-md-3 shadow d-flex align-items-center w-fill-available my-3 bg_harvest border-0"
            onClick={() => {
              props.onChangeWallet(1);
              props.onHide();
            }}
          >
            <img src={props.themeClass ? Metamask : MetamaskDark} />
            <h3 className="text_app mb-0 ml-3">Metamask</h3>
          </Button>
          <Button
            variant="light"
            className="mx-md-3 shadow d-flex align-items-center w-fill-available mb-5 bg_harvest border-0"
            onClick={() => {
              props.onChangeWallet(2);
              props.onHide();
            }}
          >
            <img src={props.themeClass ? WConnect : WConnectDark} />
            <h3 className="text_app mb-0 ml-3"> WalletConnect</h3>
          </Button>
        </div>
      </Modal.Body>
      {/* <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer> */}
    </Modal>
  );
}

export default ConectWallet;
