import React from 'react'
import {Link} from 'react-router-dom'

export const LinksList = ({ links }) => {
  if (!links.length) {
    return <h2 className="center">нет записи</h2>
  }

  return (
    <table class="table table-bordered table-striped">
    <thead>
    <tr>
        <th>Date</th>
        <th>From</th>
        <th>video</th>
        <th>Duration</th>
    </tr>
    </thead>
    <tbody id="myTable">
      { links.map((element, index) => {
        return (
          <tr key={element._id}>
            <td>{new Date(`${element.date}`).toLocaleDateString()}</td>
            <td>{element.callFrom}</td>
            <td>
              {/* <a href={`http://localhost:5000/static/${element.videoName}.webm`}>Открыть</a> */}
              <a href={`https://kosg.su/static/${element.videoName}.webm`}>Открыть</a>
            </td>
            <td>{element.duration}</td>
          </tr>
        )
      }) }
      </tbody>
</table>
  )
}
