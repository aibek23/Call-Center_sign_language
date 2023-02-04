import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {Context} from '../context/Context'
import {Loader} from '../components/Loader'
import { VideoCard } from '../components/VideoCard'

export const VideoPage = () => {
  const operatorRoomId = 1
  const [videoPath, setVideoPath] = useState([])
  const {loading, request} = useHttp()
  const {token} = useContext(Context)

  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request(`/api/video/operator/${operatorRoomId}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      setVideoPath(fetched)
    } catch (e) {}
  }, [token, request])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  if (loading) {
    return <Loader/>
  }

  return (
    <>
      <div className="input-group">
          <div className="form-outline">
              <input type="search" id="form1" className="form-control" />
              <label className="form-label" for="form1">Search</label>
          </div>
          <button type="button" className="btn btn-primary">
              <i className="fas fa-search"></i>
          </button>
      </div>
      {!loading && <VideoCard  />}
    </>
  )
}