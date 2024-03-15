import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import HeaderLogo from './logo2.png'

function Header() {
    return (
        <div className="header">
            <Container>                
                <Navbar.Brand href="/">
                <img height={30} src={HeaderLogo}/>
                    &nbsp;
                    Management System
                </Navbar.Brand>
            </Container>
        </div>
    );
}

export default Header;