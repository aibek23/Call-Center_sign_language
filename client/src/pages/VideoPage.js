import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {Context} from '../context/Context'
import {Loader} from '../components/Loader'
// import { VideoCard } from '../components/VideoCard'
import { LinksList } from '../components/LinksList'

export const VideoPage = () => {
  const operatorRoomId = useParams().id
  const [videoPath, setVideoPath] = useState([])
  const {loading, request} = useHttp()
  const {token} = useContext(Context)

  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request(`/api/video/operator/${operatorRoomId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setVideoPath(fetched)
    } catch (e) {console.log(e)}
  }, [token, request])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  if (loading) {
    return <Loader/>
  }
  console.log(videoPath);


  return (
    <>


      <div class="container">
 
        <input class="form-control mb-4 mt-4" id="tableSearch" type="text"
            placeholder="Type something to search list items" />

        {!loading && <LinksList links={videoPath}  />}
        </div>
    </>
  )
}