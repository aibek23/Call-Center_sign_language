import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {toast, ToastContainer} from 'react-toastify'
import { Header } from '../components/Header'
import 'react-toastify/dist/ReactToastify.css'
import styles from '../css/AuthPage.module.css'

export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const {loading, request, error, clearError} = useHttp()
  // const [errorMessage, useerrorMessage] = useState(" ")
  const [form, setForm] = useState({
    email: '', password: ''
  })
  const [tabPanes, setTabPanes] = useState({activebtn1:true,activebtn2:false});

  useEffect(() => {
    error&&toast.error(`${error}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
    clearError()
  }, [error, clearError])

  // useEffect(() => {
  //   window.M.updateTextFields()
  // }, [])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
    console.log(event.target.name);
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      toast.info(`${data.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
   
    } catch (e) {}
  }

  const loginHandler = async () => {
    // console.log({...form});
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      auth.login(data.token, data.userId , form.email)
    } catch (e) {}
  }
  const tabPane1 = () =>{
    setTabPanes({activebtn1:true,activebtn2:false})
  }
  const tabPane2 = () =>{
    setTabPanes({activebtn1:false,activebtn2:true})
  }

  return (<>
  < Header />
    <div >
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
      <div className="container mt-5" >
      <div className="row justify-content-center  align-content-center" style={{"height":"100%","marginTop":"50px"}}>
      <div className="col-md-offset-3 col-md-6 ">

         <div className={styles.tab} role="tabpanel">
            <ul className={"nav "+styles.nav_tabs} role="tablist">
              <li role="presentation" className={tabPanes.activebtn1?styles.active:""}><button aria-controls="home" role="tab" data-toggle="tab" onClick={()=>tabPane1()}>sign in</button></li>
              <li role="presentation" className={tabPanes.activebtn2?styles.active:""} ><button href="#Section2" aria-controls="profile" role="tab" data-toggle="tab" onClick={()=>tabPane2()}>sign up</button></li>
            </ul>
            <div className={styles.tab_content+" tabs"}>{tabPanes.activebtn1?
              <div role="tabpanel" className="tab-pane" id="Section1" >
                <form className={styles.form_horizontal}>
                  <div className={"form-group "+ styles.form_group}>
                    <label htmlFor="exampleInputEmail1">Email</label>
                    <input type="email" className={"form-control " + styles.form_control}                     
                    id="email"
                    name="email"
                    value={form.email}
                        onChange={changeHandler} />
                  </div>
                  <div className={styles.form_group+" form-group "}>
                    <label htmlFor="exampleInputPassword1">пароль</label>
                    <input type="password" className={styles.form_control+" form-control"}

                                      id="password"
                  name="password"
                  value={form.password}
                  onChange={changeHandler} />
                  </div>
                  <div className={"form-group "+styles.form_group}>
                    <div className={" form-check "+styles.main_checkbox_+" form-check"}>
                       {/* <input value="None" id="checkbox1" name="check" type="checkbox"/>
                       <label htmlFor="checkbox1"></label> */}
                      <input className="form-check-input" style={{"marginLeft":"0px"}} type="checkbox"  id="flexCheckDefault" />
                      <label className="form-check-label" htmlFor="flexCheckDefault"> запомнить меня
                      </label>
                    </div>
                  </div>
                  <div className="form-group forgot_pass">
                      <button type="submit"
                        className="btn btn-warning w-100"
                        style={{ "fontWeight": "bold", "color": "#fff", "borderRadius": "20px" }}
                        disabled={loading}              
                        onClick={loginHandler}
                      >Войти</button>
                  </div>
                </form>
              </div>:
              <div role="tabpanel" className="tab-pane  " id="Section2"  >
                <form className={styles.form_horizontal}>
            <div className={"form-group "+ styles.form_group}>
                    <label htmlFor="exampleInputEmail2">имя</label>
                                  <input
                                    placeholder="ведите ваше имя"
                                    id="exampleInputEmail2"
                                    type="text"
                                    name="name"
                                    className={"form-control " + styles.form_control}
                                    value={form.name}
                                    onChange={changeHandler}
                                  />        
                  </div>
                  <div className={styles.form_group} style={{}}>
                    <label htmlFor="exampleInputEmail1">фамилия</label>

                                    <input
                                      placeholder="ведите ваше фамилия"
                                      id="exampleInputEmail1"
                                      type="text"
                                      name="surname"
                                      className={"form-control " + styles.form_control}
                                      value={form.surname}
                                      onChange={changeHandler}
                                    />
      
                  </div>
                  <div className={styles.form_group}>
    
                    <label htmlFor="exampleInputEmail1">Email</label>
                      <input
                        placeholder="Введите email"
                        id="email"
                        type="text"
                        name="email"
                        className={"form-control " + styles.form_control}
                        value={form.email}
                        onChange={changeHandler}
                      />
                  </div>
                  <div className={styles.form_group+" form-group "}>
                    <label htmlFor="exampleInputPassword1">пароль</label>
                      <input type="password"
                        className={styles.form_control + " form-control"}
                                  placeholder="Введите пароль"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={changeHandler}
                      />
                  </div>
                  <div className={"form-group "+styles.form_group}>
                    <div className={" form-check "+styles.main_checkbox_+" form-check"}>
                       {/* <input value="None" id="checkbox1" name="check" type="checkbox"/>
                       <label htmlFor="checkbox1"></label> */}
                      <input className="form-check-input" style={{"marginLeft":"0px"}} type="checkbox"  id="flexCheckDefault" />
                      <label className="form-check-label" htmlFor="flexCheckDefault"> запомнить меня
                      </label>
                    </div>
                  </div>
                  <div className="form-group forgot_pass">
                      <button type="submit"
                        className="btn btn-warning w-100"
                        onClick={registerHandler}                                                      
                        disabled={loading}
                        style={{ "fontWeight": "bold", "color": "#fff", "borderRadius": "20px" }}>
                        Регистрация</button>
                  </div>
                </form>
              </div>}
            </div>
          </div>
          {/* <style type="text/css" > {styles}</style>  */}

{/* 
        <div classNameName="card blue darken-1">
          <div classNameName="card-content white-text">
            <span classNameName="card-title">Авторизация</span>
            <div>
            <div classNameName="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  classNameName="yellow-input"
                  value={form.name}
                  onChange={changeHandler}
                />
                <label htmlFor="name">имя</label>
              </div>
              <div classNameName="input-field">
                <input
                  placeholder="Введите email"
                  id="surname"
                  type="text"
                  name="surname"
                  classNameName="yellow-input"
                  value={form.surname}
                  onChange={changeHandler}
                />
                <label htmlFor="surname">фамилия</label>
              </div>

              <div classNameName="input-field">
                <input
                  placeholder="Введите email"
                  id="email"
                  type="text"
                  name="email"
                  classNameName="yellow-input"
                  value={form.email}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div classNameName="input-field">
                <input
                  placeholder="Введите пароль"
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={changeHandler}
                />
                <label htmlFor="password">Пароль</label>
              </div>

            </div>
          </div>
          <div classNameName="card-action">
            <button
              classNameName="btn yellow darken-4"
              style={{marginRight: 10}}
              disabled={loading}
              onClick={loginHandler}
            >
              Войти
            </button>
            <button
              classNameName="btn grey lighten-1 black-text"
              onClick={registerHandler}
              disabled={loading}
            >
              Регистрация
            </button>
          </div>
        </div> */}
    </div>
    </div>
    </div>
</div>
</>
  )
}
