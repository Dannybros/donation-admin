import React from 'react'
import {Navbar, Nav, Form , NavDropdown, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom'
import {useTranslation} from "react-i18next";

function Navigation() {

  const {i18n} = useTranslation();

  const changeLang=(e)=>{
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  }

  return (
    <Navbar bg='light' sticky='top' style={{
      borderBottom:"1px solid #ddd",
      height:"80px"
    }}>
      <Container>
        <Navbar.Brand as={Link} to="#">
          <img
            alt=""
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Nav
          className="me-auto my-2 my-lg-0"
          style={{ maxHeight: '100px', fontSize:"clamp(14px, 3vw, 20px)", gap:"20px"}}
          navbarScroll
        >
          <Nav.Link href="/">Home</Nav.Link>

          <NavDropdown title="Case" id="navbarScrollingDropdown">
            <NavDropdown.Item as={Link} to="/case" className="nav_link">
              Case List
            </NavDropdown.Item>

            <NavDropdown.Divider />

            <NavDropdown.Item as={Link} to="/make/case" className="nav_link">
              Make Case
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="News" id="navbarScrollingDropdown">
            <NavDropdown.Item as={Link} to="/news" className="nav_link">
              Browse News
            </NavDropdown.Item>

            <NavDropdown.Divider />

            <NavDropdown.Item as={Link} to="/news/list/recent" className="nav_link">
              News List
            </NavDropdown.Item>

            <NavDropdown.Divider />

            <NavDropdown.Item as={Link} to="/make/news" className="nav_link">
              Make News
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>

        <Form className="d-flex">
          <Form.Select onChange={changeLang}>
            <option value='en'>English</option>
            <option value='zh'>Chinese</option>
            <option value='ko'>Korean</option>
          </Form.Select>
        </Form>

      </Container>
    </Navbar>
  )
}

export default Navigation