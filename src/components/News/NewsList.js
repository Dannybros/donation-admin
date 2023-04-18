import React, {useState, useEffect} from 'react'
import { ListGroup, Spinner, Form } from 'react-bootstrap';
import axios from '../Axios'
import './Pagination.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate, useParams } from "react-router-dom";
import { faChevronLeft, faAngleDoubleLeft, faChevronRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

function NewsList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState({query:"", date:""});
    const [data, setData]  = useState([]);
    const { param } = useParams();

    useEffect(()=> {
        const fetchData = async () => {
            try {
                const res = await axios.get('/news')
                let sortedData;
                param==="top"? sortedData = res.data.sort((a, b) => b.view - a.view) : sortedData = res.data.sort((a, b) => a.view - b.view);
                setData(sortedData);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [param])

    const handleClick=(id)=>{
        navigate(`/news/${id}`);
    }

    const Pagination=({data, dataLimit})=>{
    
        const [totalpages] =  useState(Math.ceil(data.length/dataLimit));
        const [currentPage, setCurrentPage]= useState(1);
    
        function goToNextPage(){ setCurrentPage((page)=>page + 1) }
    
        function goToPrevPage(){ setCurrentPage((page)=>page-1); }
    
        function changePage(event){
            const pageNumber = Number(event.target.textContent);
            setCurrentPage(pageNumber);
        }
    
        const getPaginationData=()=>{
            const startIndex = (currentPage - 1) * dataLimit;
            const endIndex = Math.min(startIndex + dataLimit, data.length);
    
            return data.slice(startIndex, endIndex);
        }
    
            // Algorithm to show 5 page numbers
        const getPager=()=>{
    
            var startPage, endPage;
    
            if(totalpages<=5){
                startPage = 1;
                endPage = totalpages;
            }else{
                if(currentPage <=3){
                    startPage=1;
                    endPage =5;
                }
                else if(currentPage + 2 >= totalpages){
                    startPage = totalpages-4;
                    endPage = totalpages;
                }
                else{
                    startPage = currentPage - 2
                    endPage = currentPage +2
                }
            }
    
            var pager = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
            return pager
        }
    
        const goToLastPage=()=>setCurrentPage(totalpages);

        const goToFirstPage=()=>setCurrentPage(1);
        
        return(
            <div>
                <ListGroup className="my-3" variant="flush">
                    {getPaginationData().map((data) => (
                        <ListGroup.Item key={data._id} className="news-list-group-item" onClick={()=>handleClick(data._id)}>
                            <img src={data.img[0]} alt="" style={{height:"100px", aspectRatio:"5/3"}}/>
                            <div className='ms-4'>
                                <h4> {data.title.en}</h4>
                                <p className='news-list-text'>{data.content.en.substr(0, 300) + "..."}</p>
                                <span className='news_list_date'>{data.date.split("T")[0]}</span>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                
                <div className="pagination">
                    <button onClick={goToFirstPage} className={`prev ${currentPage === 1 ? 'disabled' : ''}`}>
                        <FontAwesomeIcon icon={faAngleDoubleLeft}/>
                    </button>
                    
                    <button onClick={goToPrevPage} className={`prev ${currentPage === 1 ? 'disabled' : ''}`}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
    
                    {getPager().map((item, index) => (
                        <button
                            key={index}
                            onClick={changePage}
                            className={`paginationItem ${currentPage === item ? 'active' : null}`}
                        >
                        <span>{item}</span>
                        </button>
                    ))}
    
                    <button onClick={goToNextPage} className={`next ${currentPage === totalpages ? 'disabled' : ''}`}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
    
                    <button onClick={goToLastPage} className={`next ${currentPage === totalpages ? 'disabled' : ''}`}>
                        <FontAwesomeIcon icon={faAngleDoubleRight}/>
                    </button>
                </div>
            </div>
        )
    }

    const handleOnChange=(e)=>{
        setSearchQuery({...searchQuery, [e.target.name]:e.target.value});
    }

    const filteredData = data.filter(item => {
        return (
            // item.title["en"].toLowerCase().includes(searchQuery.query.toLowerCase())
          ['en', 'zh', 'ko'].some(lang =>
            item.title[lang].toLowerCase().includes(searchQuery.query.toLowerCase()) ||
            item.content[lang].toLowerCase().includes(searchQuery.query.toLowerCase())
          ) &&
          (!searchQuery.date || item.date.includes(searchQuery.date))
        );
    });

    if (data.length===0) {
        return (
            <div className='news_list_loading'>
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
                value={searchQuery.query}
            />
            <Form.Group >
                <Form.Control type="date" name="date" onChange={handleOnChange} size="lg"
                value={searchQuery.date} placeholder="Date of Birth" />
            </Form.Group>
        </Form>
        <Pagination
            data={filteredData}
            dataLimit={5}
        />
    </>
  )
}

export default NewsList