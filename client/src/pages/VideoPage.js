import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { Context } from '../context/Context';
import { Loader } from '../components/Loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LinksList } from '../components/LinksList';

export const VideoPage = () => {
  const operatorRoomId = useParams().id;
  const [videoPath, setVideoPath] = useState([]);
  const { loading, request } = useHttp();
  const auth = useContext(Context);
  const { token } = auth;

  const [form, setForm] = useState('');
  const [filteredVideoPath, setFilteredVideoPath] = useState([]);
  
  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request(`/api/video/operator/${operatorRoomId}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      });
      setVideoPath(fetched);
      console.log(fetched);
    } catch (e) {
      toast.error(`${e}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }, [token, request, operatorRoomId]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  useEffect(() => {
    setFilteredVideoPath(
      videoPath.filter((link) => link.callFrom && link.callFrom.toLowerCase().includes(form.toLowerCase()))
    );
  }, [form, videoPath]);

  const changeHandler = (event) => {
    event.preventDefault();
    setForm(event.target.value);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container">
        <div className="d-flex">
          <input
            className="form-control mb-4 mt-4"
            id="tableSearch"
            type="text"
            placeholder="Type something to search list items"
            value={form}
            onChange={changeHandler}
          />
          {/* <input onClick={onFormSubmit} type="submit" className='btn btn-primary mb-4 mt-4 pl-2'></input> */}
        </div>

        {!loading && <LinksList links={filteredVideoPath} />}
      </div>
    </>
  );
};
