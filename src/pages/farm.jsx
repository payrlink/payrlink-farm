import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";

import { useWallet } from 'use-wallet';

import Logo from "../assets/logo.png";
import Footer from "../components/footer";
import Wallet from "../assets/walletSmall.svg";
import ConectWallet from "../components/conectWallet";
import FarmCard from "../components/farmCard";
import Light from "../assets/light.svg";
import Dark from "../assets/dark.svg";

const Farm = () => {
  const [modalShow, setModalShow] = useState(false);
  const [theme, setTheme] = useState(true);
  const [userAccount, setUserAccount] = useState(null);

  const { account, connect, reset, status } = useWallet();

  useEffect(() => {
    const localAccount = localStorage.getItem("account");
    const walletProvider = localStorage.getItem("walletProvider");
    if (!account && localAccount) {
      setUserAccount(localAccount);
      if (localAccount && (walletProvider === "metamask" || walletProvider === "injected")) {
        connect("injected");
        localStorage.setItem("walletProvider", "metamask");
      }
      if (localAccount && walletProvider === "walletconnect") {
        connect('walletconnect');
        localStorage.setItem("walletProvider", "walletconnect");
      }
    }
  }, []);

  const onChangeWallet = (data) => {
    if (data === 'metamask') {
      connect("injected");
      localStorage.setItem("walletProvider", "metamask");
      setModalShow(false);
    } else if (data === 'walletconnect') {
      connect("walletconnect");
      localStorage.setItem("walletProvider", "walletconnect");
      setModalShow(false);
    }
  }

  useEffect(() => {
    if (account) {
      setUserAccount(account);
      localStorage.setItem("account", account);
    }
  }, [account]);

  const onDisconnectWallet = () => {
    reset();
    setUserAccount(null);
    localStorage.removeItem("account");
    localStorage.removeItem("walletProvider");
  }

  const changeTheme = () => {
    setTheme(!theme);
  }

  // useEffect(() => {
  //   if (status === "disconnected") {
  //     setUserAccount(null);
  //     localStorage.removeItem("account");
  //     localStorage.removeItem("walletProvider");
  //   }
  // }, [status]);

  return (
    <Container fluid className="main_layout">
      <Row className="header py-4 px-md-5">
        <Col
          xl={12}
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex align-items-center">
            <img src={Logo} alt="" />
            <h4 className="ml-2 text-white mb-0">Farm</h4>
          </div>
          <div className="d-flex align-items-center">
            <Button variant="link" onClick={() => changeTheme()}>
              <img alt="theme" src={theme ? Light : Dark} />
            </Button>
            {!userAccount ? (
              <Button
                variant="light"
                className="btn_white mx-md-3 h-100"
                onClick={() => setModalShow(true)}
              >
                Connect Wallet
              </Button>
            ) : (
              <Dropdown>
                <Dropdown.Toggle
                  variant=""
                  className="btn_white"
                  id="dropdown-basic"
                >
                  <img alt="address" src={Wallet} className="mr-1" />
                  {userAccount.slice(0, 10)}...
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#" onClick={onDisconnectWallet}>
                    Disconnect
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            <ConectWallet
              show={modalShow}
              onHide={() => setModalShow(false)}
              onChangeWallet={onChangeWallet}
              themeClass={theme}
            />
          </div>
        </Col>
      </Row>
      <Row
        className={`justify-content-center p-5 ${
          theme ? "theme_light" : "theme_dark"
        }`}
      >
        <Col xl="10" className="">
          <h2 className="font-weight-bold">Stake LP tokens to earn PAYR</h2>
          <h5>Deposit Fee will be used to buyback PAYR</h5>
          <Row className="my-4 justify-content-center justify-content-lg-start">
            <FarmCard
              themeClass={theme}
              onChangeWallet={onChangeWallet}
              account={userAccount}
            />
          </Row>
        </Col>
      </Row>
      <Footer themeClass={theme} />
    </Container>
  );
};

export default Farm;
