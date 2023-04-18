import React, {useState} from 'react'
import './Login.css'
import axios from '../Axios'
import { useNavigate } from 'react-router-dom';
import {Button, Form, Spinner} from 'react-bootstrap';
import {useAlertContext} from '../Alert/AlertContext'

function Login() {

    const navigate = useNavigate();

    const {showAlert} = useAlertContext();

    const initials = {username:"", password:""}

    const [formData, setFormData] = useState(initials);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnChange=(e)=>{
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleUserLogin =async(e)=>{
        e.preventDefault();
        setIsLoading(true);
      
        if(formData.username==="" || formData.password===""){
            setIsLoading(false); 
            showAlert('danger', 'Error! You have Error!', "please fill in every field")
        }else{
            await axios.post('/signIn', formData)
            .then(res=>{
                localStorage.setItem('AuthToken', res.data.token);
                setIsLoading(false); 
                navigate('/');
            })
            .catch((error)=>{
                setIsLoading(false); 
                showAlert('danger', 'Error! You have Error!', error.response.data.message);
            })
        }
    }

    const buttonStyle = {
        width:"100px",
        pointerEvents: isLoading ? "none" : "auto",
    };

    return (
        <div className="login_page">
            <div className="form-box">
                <h2>Log In</h2>
                <Form onSubmit={handleUserLogin}>
                    <Form.Group className="mb-3" >
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" type="text" placeholder="Enter username" onChange={handleOnChange}/>
                    </Form.Group>

                    <Form.Group className="mb-4" >
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Password" onChange={handleOnChange}/>
                    </Form.Group>

                    <div className='d-flex justify-content-between'>
                        <Button variant="danger me-2" type="reset" size="lg" style={buttonStyle}>
                            Cancel
                        </Button>
                        <Button variant={!isLoading ? "primary" : "light"} style={buttonStyle} type="submit" size="lg">
                        {isLoading ? (
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                            ) : (
                            "Submit"
                        )}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Login
