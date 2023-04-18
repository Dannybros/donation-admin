import React, {useState, useRef} from 'react'
import {Row, Col, Form, Modal, Button, Spinner} from 'react-bootstrap';
import axios from './Axios'
import {useNavigate, useParams} from 'react-router-dom';
import {useAlertContext} from './Alert/AlertContext'

const initialData = {
  title:{ en:"", zh:"", ko:"" },
  content:{en:"", zh:"", ko:"" },
  date:"",
  image:[]
}

const languages = ["English", "Korean", "Chinese"]

function CreateForm() {

  const {option} = useParams();

  const navigate = useNavigate();
  const {showAlert} = useAlertContext();
  const imageRef = useRef(null);

  const [data, setData] = useState(initialData);
  const [imgFiles, setImgFiles]=useState([]);
  const [modalNews, setModalNews] = useState({state:false, lang:""});
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadNews= async(e)=>{
    e.preventDefault();
    setIsLoading(true);

    const url = checkNewsParam()? "/news" : "/case"

    if(data.image.length <= 0 || !checkModalIsFilled("English") || !checkModalIsFilled("Chinese") || !checkModalIsFilled("Korean")) {
      alert('please upload pictures');
      setIsLoading(false); 
    }
    else{
      const formData = new FormData();

      formData.append("titleEn", data.title.en)
      formData.append("titleZh", data.title.zh)
      formData.append("titleKo", data.title.ko)

      formData.append("contentEn", data.content.en)
      formData.append("contentZh", data.content.zh)
      formData.append("contentKo", data.content.ko)

      formData.append("date", data.date)

      for (let i = 0; i < data.image.length; i++) {
        formData.append("img", data.image[i]);
      }

      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
          alert("The file is successfully uploaded");
          setIsLoading(false); 
           navigate(checkNewsParam()?'/news/list/recent' : '/cases') ;
      })
      .catch((error) => { 
        setIsLoading(false); 
        const statusCode = error.response.status
        if(statusCode === 401 || statusCode ===  403) navigate('/login');        
        showAlert('danger', 'Error! You have Error!', error.response.data.message);
      });
    }
  }

  const handleOnChangeNews=(event)=>{
    let lang = modalNews.lang;
    const lang_abbr = getLangAbbr(lang)
    const { name, value } = event.target;

    setData({
      ...data, 
      [name]:{
        ...data[name], 
        [lang_abbr]:value
      }
    })
  }

  const getLangAbbr=(lang)=>{
    return lang==="English"? "en" : lang==="Korean" ? "ko" : "zh";
  }
 
  const handleImageFiles =(e)=>{
    setImgFiles([])

    for (var i=0; i< e.target.files.length; i++){
        let string = URL.createObjectURL(e.target.files[i]);
        setImgFiles(old=>[...old, string]);
    }

    setData({...data, image:e.target.files})
  }

  const handleDateOnChange=(e)=>{
    setData({...data, date:e.target.value})
  }

  const openModalNews=(lg)=>{
    setModalNews({state:true, lang:lg})
  }

  const closeModalNews=()=>{
    setModalNews({state:false, lang:""})
  }

  const clearForm = ()=>{
    const lang_abbr = getLangAbbr(modalNews.lang)
    window.confirm('Are you sure you want to CLEAR news') 
    && setData({
        ...data, 
        title:{
          ...data["title"], 
          [lang_abbr]:""
        },
        content:{
          ...data["content"], 
          [lang_abbr]:""
        }
      });
  }

  const clearImg=()=>{
    imageRef.current.value="";
    setImgFiles([])
    setData({...data, image:[]})
  }

  const checkModalIsFilled=(lang)=>{
    const lang_abbr = lang==="English"? "en" : lang==="Korean" ? "ko" : "zh";

    if(data.title[lang_abbr] ==="" && data.content[lang_abbr]==="") return false;
    else return true;
  }

  const handleClearAll =()=>{
    clearForm();
    setData(initialData);
  }

  const checkNewsParam=()=>{
    if(option==="news") return true 
    
    return false;
  }

  return (
    <div className='px-4 border-end border-start'>
      <h1 className='mb-5'> Create {checkNewsParam()? "News" : "Project"}  </h1>
      
      <section className="d-flex">
        {languages.map((lang, idx)=>(
          <div className='mx-2 w-100 d-flex flex-column align-items-center' key={idx}>
            <Button variant="primary" size="lg" onClick={()=>openModalNews(lang)}>
              {lang}
            </Button>
            <p className={`text-center mt-2 ${checkModalIsFilled(lang)? "text-success" : "text-danger"}`}> 
              {checkModalIsFilled(lang)? "Filled" : "Not Filled"} 
            </p>
          </div>
        ))}
      </section>

      <figure className="mt-4">
        <Form.Group>
          {checkNewsParam() &&
            <>
            <Form.Label>Date</Form.Label>
            <Form.Control className='mb-5 w-50' type="date" name="date" size="lg" value={data.date} onChange={handleDateOnChange} />
            </>
          }
          <Form.Label>Images</Form.Label>
          <Form.Control type="file" size="lg" ref={imageRef} multiple onChange={handleImageFiles} />
        </Form.Group>
        {!imgFiles.length<=0 &&
          <Button variant="danger" className='my-3' onClick={clearImg}>
            Clear Images
          </Button>
        }
        <Row>
        {imgFiles.map(img=>(
          <Col lg={3} md={6} style={{margin:'10px 0'}} key={img}>
            <img src={img} alt="" style={{width:'100%', maxHeight:"300px", objectFit:"contain"}}/>
          </Col>
        ))}
        </Row>
      </figure>
        
      <div className='d-flex gap-3 mt-5'>
        <Button className='w-50' variant="danger" size="lg" onClick={handleClearAll}>
          Cancel
        </Button>
        <Button 
          className='w-50 me-1' 
          variant={!isLoading ? "primary" : "light"} 
          size="lg" 
          onClick={handleUploadNews} 
          style={{pointerEvents: isLoading ? "none" : "auto"}}
        >
          {isLoading ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
            ) : (
            "Submit"
          )}
        </Button>
      </div>

      <Modal
        size="lg"
        // backdrop="static"
        keyboard={false}
        show={modalNews.state}
        onHide={closeModalNews}
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {modalNews.lang} Language News
          </Modal.Title>
        </Modal.Header>
        
        <Form>  {/*encType="multipart/form-data" */}
        <Modal.Body>
            <Form.Group className="mb-3" controlId="news_edit_title">
              <Form.Label>NEWS Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="News Title"
                name="title"
                autoFocus
                value={data.title[getLangAbbr(modalNews.lang)]}
                onChange={handleOnChangeNews}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="news_edit_content">
              <Form.Label>NEWS Context</Form.Label>
              <Form.Control 
                as="textarea" 
                placeholder='Overall...' 
                rows={20} 
                name="content"
                value={data.content[getLangAbbr(modalNews.lang)]} 
                onChange={handleOnChangeNews}
              />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={clearForm}>
            Clear News
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default CreateForm