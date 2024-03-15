import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';

function MyInformations() {
    const [informations, setInformations] = useState();

    useEffect(() => {
        let userId = localStorage.getItem("userId");
        axios.get(`https://localhost:7020/api/Information/${userId}`)
            .then(response => {
                setInformations(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [])

    return (
        <div className="content">
            <br/>
            <Alert key="secondary" variant="secondary">
                My Informations
            </Alert>
            {informations?.length > 0 ?
                <div className="box">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {informations?.map(info => (
                                <tr>
                                    <td>{info.title}</td>
                                    <td>{info.description}</td>
                                </tr>
                            ))}
                        </tbody>
                        <br />
                    </Table>
                </div>
                :
                <div className="box"><h5>No informations found!</h5><br /> </div>
            }
        </div>
    );
}

export default MyInformations;