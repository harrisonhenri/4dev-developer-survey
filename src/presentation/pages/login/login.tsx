import React from 'react'
import Styles from './login-styles.scss'
import { FiAlertCircle } from 'react-icons/fi'

import Logo from '@/presentation/components/logo/logo'

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}>
        <Logo/>
        <h1>4Dev - Enquetes para Programadores</h1>
      </header>
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
      <footer className={Styles.footer} />
    </div>
  )
}

export default Login
