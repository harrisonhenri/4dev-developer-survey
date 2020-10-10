import React from 'react'
import Styles from './login-styles.scss'
import { FiAlertCircle } from 'react-icons/fi'

import LoginHeader from '@/presentation/components/login-header/login-header'
import Footer from '@/presentation/components/footer/footer'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <LoginHeader/>
      <form className={Styles.form}>
        <h2>Login</h2>
        <div className={Styles.inputContainer}>
          <input type="email" name="email" id="E-mail"/>
          <span className={Styles.inputStatus}><FiAlertCircle color="#c53030" size={20} /></span>
        </div>
        <div className={Styles.inputContainer}>
          <input type="password" name="password" id="Senha"/>
          <span className={Styles.inputStatus}><FiAlertCircle color="#c53030" size={20} /></span>
        </div>
        <button type="submit">Entrar</button>
        <span className={Styles.link}>Criar conta</span>
        <div className={Styles.errorContainer}>
          <span className={Styles.formStatus}><FiAlertCircle color="#c53030" size={20} /></span>
          <span className={Styles.error}>Erro</span>
        </div>
      </form>
      <Footer/>
    </div>
  )
}

export default Login
