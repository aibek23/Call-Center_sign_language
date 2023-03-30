import React from 'react'

export const LinksList = ({ links }) => {
  if (!links.length) {
    return <h2 className="center">нет записи</h2>
  }

  return (
    <>
      {links.map((element, index) => {
        return (
          <div key={index} className="bg-light row mb-3" style={{ "maxWidth": "35rm" }}>
            <div className='col-6'>
              <ul className="list-group">
                <div>Дата</div>
                <li className="list-group-item text-sm">{new Date(`${element.date}`).toLocaleDateString()}</li>
                <div>Звонок от</div>
                <li className="list-group-item text-sm" style={{ "overflowY": "auto" }}>{element.callFrom}</li>
              </ul>
            </div>
            <div className='col-6'>
              <div className="d-flex flex-column align-content-end">
                <ul className="list-group w-100">
                  <div>Длительность</div>
                  <li className="list-group-item">{element.duration}</li>
                </ul>
                {/* <a className="btn btn-link text-sm mt-4" href={`http://localhost:5000/static/${element.videoName}.webm`}>Посмотреть видео</a> */}
                <a className="btn btn-primary text-sm mt-4" href={`https://kosg.su/static/${element.videoName}.webm`}>Посмотреть видео</a>

              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
