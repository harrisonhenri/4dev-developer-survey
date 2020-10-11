import React, { useState } from 'react'
import Styles from './login-styles.scss'
import Context from '@/presentation/context/form/form-context'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'

const Login: React.FC = () => {
  const [errorState] = useState({ main: '', email: 'Campo obrigatório', password: 'Campo obrigatório' })

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ errorState }}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" id="E-mail"/>
          <Input type="password" name="password" id="Senha"/>
          <button disabled type="submit">Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer/>
    </div>
  )
}

export default Login
