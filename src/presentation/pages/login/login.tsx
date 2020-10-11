import React, { useState, useEffect } from 'react'
import Styles from './login-styles.scss'
import Context from '@/presentation/context/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'

type Props = {
  validation: Validation
}

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({ main: '', email: '', password: '', emailError: 'Campo obrigatório', passwordError: 'Campo obrigatório' })

  useEffect(() => {
    validation.validate({ email: state.email })
  }, [state.email, validation])

  useEffect(() => {
    validation.validate({ password: state.password })
  }, [state.password, validation])

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
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
