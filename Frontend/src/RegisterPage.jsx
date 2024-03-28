import { useState } from "react"
import { useEffect } from "react"


function RegisterPage(){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")

    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("") 
    const [existingUsers, setExistingUsers] = useState({
        usernames: [],
        emails: [],
        phones: []
    });

    useEffect(() => {
        fetch("http://localhost:8000/users/")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                const usernames = data.users.map(user => user.username);
                const emails = data.users.map(user => user.email);
                const phones = data.users.map(user => user.phone);
                setExistingUsers({ usernames, emails, phones });
            })
            .catch(error => {
                console.error("Error fetching existing user data:", error);
            });
    }, []);
    
    function registerUser() {
        if (username.length < 6 || existingUsers.usernames.includes(username)) {
            setUsernameError(true)
            return
        }
    
        if (password !== confirmpassword || password.length < 6) {
            setPasswordError(true)
            return
        }
    
        if (phone.length !== 11 || existingUsers.phones.includes(phone)) {
            setPhoneError(true)
            return
        }

        if (existingUsers.emails.includes(email)) {
            setEmailError(true);
            return;
        }

        fetch('http://localhost:8000/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                phone: phone
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            setErrorMessage("");
        })
        .catch(error => {
            console.error('There was an error!', error);
            setErrorMessage("Registration failed. Please try again.");
        });
    }
    

    return(
        <div>
            <div style={{marginTop: "100px", marginLeft: "200px"}}>
                <text>Username: </text>
                <input style={{marginLeft: "20px"}} type="text" onChange={(e) => setUsername(e.target.value)}></input>
            </div>

            <div style={{marginTop: "20px", marginLeft: "200px"}}>
                <text>Password: </text>
                <input style={{marginLeft: "20px"}} type="password" onChange={(e) => setPassword(e.target.value)}></input>
            </div>

            <div style={{marginTop: "20px", marginLeft: "200px"}}>
                <text>Confirm Password: </text>
                <input style={{marginLeft: "20px"}} type="password" onChange={(e) => setConfirmPassword(e.target.value)}></input>
            </div>

            <div style={{marginTop: "20px", marginLeft: "200px"}}>
                <text>Email: </text>
                <input style={{marginLeft: "20px"}} type = "email" onChange={(e) => setEmail(e.target.value)}></input>
            </div>

            <div style={{marginTop: "20px", marginLeft: "200px"}}>
                <text>Phone: </text>
                <input style={{marginLeft: "20px"}} onChange={(e) => setPhone(e.target.value)}></input>
            </div>

            <div>
                <button style={{marginLeft:"400px", marginTop: "20px"}} onClick = {registerUser}>Register</button>
            </div>


            {usernameError && (
                <div>
                    <h3>Username Error</h3>
                </div>
            )}

            {passwordError && (
                <div>
                    <h3>Password Error</h3>
                </div>
            )}

            {emailError && (
                <div>
                    <h3>Email Error</h3>
                </div>
            )}

            {phoneError && (
                <div>
                    <h3>Phone Error</h3>
                </div>
            )}


        </div>
    )
}

export default RegisterPage