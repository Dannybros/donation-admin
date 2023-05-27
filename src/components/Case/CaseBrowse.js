import React, {useState, useEffect}  from 'react'
import { Spinner, Form, Card } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";
import axios from '../Axios'
import './Case.css'

function CaseBrowse() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData]  = useState([]);
  const { i18n } = useTranslation();

  useEffect(()=> {
    const fetchData = async () => {
      try {
        const res = await axios.get('/cases');
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [])

  const handleOnChange=(e)=>{
    setSearchQuery(e.target.value);
  }

  const handleOnClick=(id)=>{
    navigate(`/case/${id}`);
  }

  const filteredData = data.filter(item => {
    return (
      ['en', 'zh', 'ko'].some(lang =>
        item.title[lang].toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  if (data.length===0) {
    return (
        <div className='case_list_loading'>
            <Spinner animation="border" role="status" className="loading-spinner"/>
        </div>
    );
  }

  return (
    <>
      <Form className="d-flex">
        <Form.Control
            type="search"
            name="query"
            placeholder="Search"
            className="me-2"
            size="lg"
            onChange={handleOnChange}
            value={searchQuery}
        />
      </Form>
      <section className='mt-4 '>
        <h1 className='border-bottom pb-2'>Projects</h1>
        <main className='case_list py-3'>
          {filteredData.map((item, idx)=>(
            <div className='px-2 pb-3'>
            <Card key={idx} className="case_card" onClick={()=>handleOnClick(item._id)}>
              <Card.Img variant="top" src={item.img[0]} />
              <Card.Body>
                <Card.Title className='case_card_title text-danger'>{item.title[i18n.language]}</Card.Title>
                <Card.Text as='a' className='case_card_text'>
                  {item.content[i18n.language]}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Posted on {item.createdAt.split("T")[0]}</small>
              </Card.Footer>
            </Card>
            </div>
          ))}
        </main>
      </section>
    </>
  )
}

export default CaseBrowse