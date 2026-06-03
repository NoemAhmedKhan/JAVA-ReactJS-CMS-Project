import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {

    useEffect(() => {
        const navigate = useNavigate();
        const token = localStorage.getItem("TOKEN");
        if(token === ""){
            navigate("/login");
            return;
        }

        fetch('http://localhost:8080/dashboard', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(result => console.log('Success:', result))
            .catch(error => console.log(error));
    }, []);

    return <h1>MAIN DASHBOARD</h1>
}

export default Dashboard;