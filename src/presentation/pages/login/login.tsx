import React, { useState, useEffect } from 'react'
import Styles from './login-styles.scss'
import Context from '@/presentation/context/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'
import { Link, useHistory } from 'react-router-dom'

import { LoginHeader, Footer, Input, FormStatus } from '@/presentation/components'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const history = useHistory()

  const [state, setState] = useState({ isLoading: false, mainError: '', email: '', password: '', emailError: '', passwordError: '' })

  useEffect(() => {
    setState({ ...state, emailError: validation.validate('email', state.email), passwordError: validation.validate('password', state.password) })
  }, [state.email, state.password, validation])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    try {
      if (state.isLoading || state.emailError || state.passwordError) {
        return
      }
      setState({ ...state, isLoading: true })

      const { email, password } = state

      const account = await authentication.auth({ email, password })

      localStorage.setItem('accessToken', account.acessToken)

      history.replace('/')
    } catch (error) {
      setState({ ...state, isLoading: false, mainError: error.message })
    }
  }

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" id="E-mail"/>
          <Input type="password" name="password" id="Senha"/>
          <button disabled={!!state.emailError || !!state.passwordError} type="submit">Entrar</button>
          <Link data-testid='signup' to="/signup" className={Styles.link}>Criar conta</Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer/>
    </div>
  )
}

export default Login
