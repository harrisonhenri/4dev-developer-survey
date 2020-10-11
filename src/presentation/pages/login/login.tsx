import React, { useState, useEffect } from 'react'
import Styles from './login-styles.scss'
import Context from '@/presentation/context/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [state, setState] = useState({ main: '', email: '', password: '', emailError: '', passwordError: '' })

  useEffect(() => {
    setState({ ...state, emailError: validation.validate('email', state.email), passwordError: validation.validate('password', state.password) })
  }, [state.email, state.password, validation])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const { email, password } = state

    await authentication.auth({ email, password })
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" id="E-mail"/>
          <Input type="password" name="password" id="Senha"/>
          <button disabled={!!state.emailError || !!state.passwordError} type="submit">Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer/>
    </div>
  )
}

export default Login
