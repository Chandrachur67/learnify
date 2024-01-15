import React, { useEffect, useRef, useState } from "react";
import "./Video.css"
import {useParams} from "react-router-dom"
import { Avatar } from "@mui/material";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from "react-toastify";
import LoadingBar from 'react-top-loading-bar'
import CircularProgress from "@mui/material/CircularProgress";
const Video=()=>{
    const { id } = useParams();
    const [data,setData]=useState({});
    const [comments,setComment]=useState([])
    const [input,setInput]=useState("");
    const [url,setUrl]=useState('');
    const [loader,setLoader]=useState(false);
    const ref = useRef(null)

    const fetchVideoDetails = async () => {
        const res = await fetch(`http://localhost:8000/video/getVideo/${id}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        });
        const data = await res.json();

        setComment(data.video.comments)
        setData(data.video)
        setUrl(data.video.videoFile);
        console.log(data.video);
        console.log(url);
    }
    useEffect(() => {
        fetchVideoDetails();
    }, [])

    const getTime = (data) => {
        const dateObject = new Date(data);
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        var time = "";
        let period = hours >= 12 ? "PM" : "AM";
        time += `${hours}:${minutes} ${period}`;
        return time;
    }
    const getDate = (data) => {
        const dateObject = new Date(data);
        const year = dateObject.getUTCFullYear();
        const month = dateObject.getMonth() + 1;
        const monthNames = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];
        const day = dateObject.getDate();
        var date = ""
        date += `${day},${monthNames[month-1]} ${year}`;
        return date
    }
    const changeHandler=(env)=>{
        setInput(env.target.value);
    }
    const commentHandler=async()=>{
        if(input===''){
            toast.error("Validation Error! Do not leave the input blank",{
                position:'top-center'
            })
        }
        else{
            setLoader(true)
            ref.current.continuousStart()
            const url=window.location.href.split('/')[4];
            console.log(localStorage.getItem('token'))
            const res = await fetch("http://localhost:8000/video/addComment", {
                method:'POST',
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    videoId:url,
                    text:input
                })
            });
            const data=res.json();
            console.log(data)
            ref.current.complete()
            setLoader(false)
            toast.success("Comment Posted",{
                position:'top-center'
            })
            fetchVideoDetails();
        }  
    }
    return <>
        <ToastContainer/>
        <LoadingBar color="black" ref={ref} className="loading-bar"/>
        <div className="video-box">
            <div className="video-player">
                <div className="video">
                    <video
                        id="my-player"
                        className="video-js"
                        controls
                        controlsList="nodownload"
                        poster={data.thumbnail}
                        preload="auto"
                        data-setup='{}'>
                    <source src={url}></source>
                    </video>
                </div>
                <div className="video-info">
                    <div className="header1">
                        <h3>{data.title}</h3>
                    </div>
                    <div className="avatar-box">
                        <div className="avatar">
                            <Avatar />
                        </div>
                        <div className="count-info">
                            <div className="name">
                                <span className="instructor">{"sd"}</span>
                                <span className="link">View Portal<ArrowOutwardIcon className="arrow-icon"/></span>
                            </div>
                            <div className="like-count">
                                <div>
                                    <span><ThumbUpOffAltIcon/></span>
                                    <span className="text">{data.like}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="posted-time">
                        <span>Posted on {getTime(data.createdAt)},  {getDate(data.createdAt)}</span>
                    </div>
                    <div className="description">
                        <p>{data.description}</p>
                    </div>
                </div>
            </div>
            <div className="comment-box">
                <div className="header1"><h4><span>{comments.length}</span> Comments</h4></div>
                <div className="comment-field">
                    <input className="input" placeholder="Add a comment" onChange={changeHandler}></input>
                </div>
                <div className="comment-btn">
                    {loader?<CircularProgress />:<button className="button-21" onClick={commentHandler}>Comment</button>}
                </div>
                <div className="comments">
                    {comments.map((data,index)=>(
                        <div className="chats" key={index}>
                            <div className="username">
                                <span>Chandrachur</span>
                            </div>
                            <div className="time">
                                <span>{getTime(data.timestamp)}, {getDate(data.timestamp)}</span>
                            </div>
                            <div className="text">
                                <span>{data.text}</span>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    </>
}
export default Video