// src/app/layout.tsx
"use client";
import { useState } from "react";
import "./globals.css";
import { Roboto } from "next/font/google";
import styled from "styled-components";
import Link from "next/link";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const Header = styled.header`
  background-color: #98afc7; /* Biru muda */
  padding: 1rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavBrand = styled.div`
  display: flex;
  align-items: center;
  color: #2c3e50; /* Warna teks gelap */
  font-size: 1.5rem;

  i {
    margin-right: 0.5rem;
  }
`;

const NavLinks = styled(
  ({
    isOpen,
    children,
    role,
    ...rest
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    role?: string;
  }) => (
    <ul {...rest} role={role}>
      {children}
    </ul>
  )
)`
  display: flex;
  list-style: none;

  @media (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background-color: #98afc7; /* Biru muda */
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    padding: 1rem;
  }
`;

const NavItem = styled.li`
  margin-left: 1rem;

  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }

  a {
    color: #2c3e50; /* Warna teks gelap */
    text-decoration: none;
    display: flex;
    align-items: center;

    i {
      margin-right: 0.5rem;
    }
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #2c3e50; /* Warna teks gelap */
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Footer = styled.footer`
  background-color: #dfe6e9; /* Abu-abu muda */
  color: #2c3e50; /* Warna teks gelap */
  padding: 2rem 0;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const FooterSection = styled.div`
  margin: 1rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;

  a {
    color: #2c3e50; /* Warna teks gelap */
    font-size: 1.5rem;
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className={roboto.className}>
        <Header>
          <Nav>
            <NavBrand>
              <i className="fas fa-om"></i>
              <h1>Spiritual Journey</h1>
            </NavBrand>
            <HamburgerButton onClick={() => setIsNavOpen(!isNavOpen)}>
              <i className="fas fa-bars"></i>
            </HamburgerButton>
            <NavLinks isOpen={isNavOpen} role="navigation">
              <NavItem>
                <Link href="/" passHref>
                  <a>
                    <i className="fas fa-home"></i>
                    <span>Home</span>
                  </a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/login" passHref>
                  <a>
                    <i className="fas fa-user"></i>
                    <span>Login</span>
                  </a>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/admin" passHref>
                  <a>
                    <i className="fas fa-cog"></i>
                    <span>Admin</span>
                  </a>
                </Link>
              </NavItem>
            </NavLinks>
          </Nav>
        </Header>
        <main>{children}</main>
        <Footer>
          <FooterContent>
            <FooterSection>
              <h3>Spiritual Journey</h3>
              <p>Embracing mindfulness and inner peace</p>
            </FooterSection>
            <FooterSection>
              <h3>Connect With Us</h3>
              <SocialLinks>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
              </SocialLinks>
            </FooterSection>
            <FooterSection>
              <p>
                &copy; 2024 Spiritual Journey by RICKNZM. All rights reserved.
              </p>
            </FooterSection>
          </FooterContent>
        </Footer>
      </body>
    </html>
  );
}
