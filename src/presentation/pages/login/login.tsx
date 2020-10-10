import React, { useState } from 'react'
import Styles from './login-styles.scss'
import Context from '@/presentation/context/form/form-context'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'

type StateProps = {
  errorMessage: string
}

const Login: React.FC = () => {
  const [state] = useState<StateProps>({ errorMessage: '' })

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={state}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" id="E-mail"/>
          <Input type="password" name="password" id="Senha"/>
          <button type="submit">Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer/>
    </div>
  )
}

export default Login
