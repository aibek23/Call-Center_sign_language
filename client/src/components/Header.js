import React, { useContext, useState,useEffect } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Header = (props) => {
  const isAuthenticated = props.props;
  const [authenticated, setAuthenticated] = useState(false)
  useEffect(()=>{ if (isAuthenticated !== null) {
    setAuthenticated(true)
  }},[])
  const history = useHistory()
  const auth = useContext(AuthContext)
  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  // menuToggle.classList.remove('collapse')
  // navLinks.forEach((l) => {
  //     l.addEventListener('click', () => { menuToggle.classList.remove('show')  })
  // })
  return (
    <div >
      {/* <Navbar bg="light" expand="md" classNameName="mb-3 navbar-dark" style={{ "backgroundColor": "#2f0b45"}}>
     <Container fluid>
       <Navbar.Brand  href="/HomePage">домашняя страница</Navbar.Brand>
       <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
       <Navbar.Offcanvas
        //  id={`offcanvasNavbar-expand-md`}
         aria-labelledby={`offcanvasNavbarLabel-expand-md`}
         placement="end"
       >
         <Offcanvas.Header closeButton>
           <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
             Offcanvas
           </Offcanvas.Title>
         </Offcanvas.Header>
         <Offcanvas.Body>
           <Nav classNameName="justify-content-end flex-grow-1 pe-3">
           <NavLink classNameName="nav-link nav_link" to="/About">о нас</NavLink>
          <NavLink classNameName="nav-link nav_link" to="/CallsPage">звонки</NavLink>
              <NavLink classNameName="nav-link nav_link" to="/CallPage">позвонить</NavLink>
              <a classNameName="nav-link nav_link" href="/" onClick={logoutHandler}>Выйти</a>
           </Nav>
           <Form classNameName="d-flex">
             <FormControl
               type="search"
               placeholder="Search"
               classNameName="me-2"
               aria-label="Search"
             />
             <Button variant="outline-success">Search</Button>
           </Form>
         </Offcanvas.Body>
       </Navbar.Offcanvas>
     </Container>
   </Navbar> */}


      <nav className="navbar navbar-expand-md navbar-dark  navbarbg" >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Fixed navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              {authenticated ? isAuthenticated ?
                <li className="nav-item">
                  <NavLink className="nav-link" to="/Call_OperatorsPage">прием звонков</NavLink>
                </li> :
                <li className="nav-item">
                  <NavLink className="nav-link" to="/CallPage">позвонить</NavLink>
                </li> : ' '}
            </ul>
            <ul className='navbar-nav'>
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={logoutHandler}>выйти</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
