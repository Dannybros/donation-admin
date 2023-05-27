import React, {useState, useEffect} from 'react'
import axios from '../Axios'
import {Button} from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import {useAlertContext} from '../Alert/AlertContext'
import {useTranslation} from "react-i18next";

function Case() {
  const navigate = useNavigate();

  const [data, setData]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {showAlert} = useAlertContext();
  const { id } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
       await axios.get(`/cases/get/${id}`)
       .then(res=>setData(res.data[0]))
       .catch(err=>{
          err.response.status===404 ? navigate("/404") : navigate(-1)
       });
      setIsLoading(false);
    };

    fetchData();
  }, [id, navigate])
  
  function textIntoSentences(content) {
    return content.split(/[.!?]+/).map(sentence => sentence.trim()).filter(sentence => sentence !== "").map(sentence => sentence + ".");
  }
  
  function DivideSentences() {
    const sentences = textIntoSentences(data.content[i18n.language]);
    const numImages = data.img.length;
    let sentencesPerParagraph = Math.ceil(sentences.length / (numImages + 1));
    
    let paragraphs = [];
    for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
        paragraphs.push(sentences.slice(i, i + sentencesPerParagraph));
    }

    return (
      <section className='mt-3'>
      {paragraphs.map((paragraph, index) => (
        <main key={index} className="news_details">
          <p className='news_detail_para'>
          {paragraph.map(sentence => (
            <span key={sentence}>{sentence} </span>
          ))}
          </p>
          {index < numImages-1 && <img src={data.img[index+1]} alt={`img${index+1}`}/>}
        </main>
      ))}
      </section>
    );
  }
  
  const handleDeleteNew = ()=>{
    if(window.confirm('Do you really wish to DELETE this Case?')){

      axios.post(`/cases/delete/${id}`, data.img)
      .then(res=>{
        navigate('/case');
      })
      .catch((error)=>{
        const statusCode = error.response.status
        if(statusCode === 401 || statusCode ===  403) navigate('/login');        
        showAlert('danger', 'Error! You have Error!', error.response.data.message);
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
 
  return (
    <>
      <img alt="" src={data.img[0]} style={{height:"20vw", width:"100%", objectFit:"cover"}}/>
      <h1 className='mb-2 mt-3'>{data.title[i18n.language]}</h1>
      <span className='news_card_span mx-2'>{data.createdAt.split("T")[0]} </span>
      <DivideSentences/>
      <Button className="w-100" size="lg" variant="danger" onClick={handleDeleteNew}> Delete </Button>
    </>
  )
}

export default Case