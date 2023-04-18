import React from 'react'
import {Navbar, Nav, Form , NavDropdown, Container} from 'react-bootstrap';

function Navigation() {
  return (
    <Navbar bg='light' sticky='top' style={{
      borderBottom:"1px solid #ddd",
      height:"80px"
    }}>
      <Container>
        <Navbar.Brand href="#">
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
          <NavDropdown 
            title="Case" 
            id="navbarScrollingDropdown"
          >
            <NavDropdown.Item href="/case"
              style={{fontSize:"clamp(12px, 2vw, 16px)"}}
            >
              Case List
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/make/case"
              style={{fontSize:"clamp(12px, 2vw, 16px)"}}
            >
              Make Case
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown 
            title="News" 
            id="navbarScrollingDropdown"
            
          >
            <NavDropdown.Item href="/news"
              style={{fontSize:"clamp(12px, 2vw, 16px)"}}
            >
              Browse News
            </NavDropdown.Item>
            <NavDropdown.Divider />

            <NavDropdown.Item href="/news/list/recent"
              style={{fontSize:"clamp(12px, 2vw, 16px)"}}
            >
              News List
            </NavDropdown.Item>
            <NavDropdown.Divider />

            <NavDropdown.Item href="/make/news"
              style={{fontSize:"clamp(12px, 2vw, 16px)"}}
            >
              Make News
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Form className="d-flex">
          <Form.Select>
            <option>English</option>
            <option>Chinese</option>
            <option>Korean</option>
          </Form.Select>
        </Form>
      </Container>
    </Navbar>
  )
}

export default Navigation