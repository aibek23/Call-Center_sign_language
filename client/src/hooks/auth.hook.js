import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
   const [userEmail, setUserEmail] = useState(null)

  const login = useCallback((jwtToken, id, useremail, username, surname, checkbox) => {
    setToken(jwtToken)
    setUserId(id)
    setUserEmail(useremail)
    checkbox&&localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken, username:username, usersurname:surname, userEmail:useremail
    }))
  }, [])


  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
     setUserEmail(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId, data.userEmail)
    }
    setReady(true)
  }, [login])


  return { login, logout, token, userId, ready , userEmail }
}
