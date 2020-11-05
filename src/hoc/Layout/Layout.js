import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const Layout = (props) => (
    <div>
        <Container>
            <Row>
                <Col></Col>
                <Col xs={8}>
                    {props.children}
                </Col>
                <Col></Col>
            </Row>
        </Container>
    </div>
)

export default Layout;