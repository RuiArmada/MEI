import React, { useState } from 'react';
import { Input } from "../items/Input"
import { SignInButton } from "../items/SignInButton";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from '../../hooks/useAuth'
import '../../css/views/SignInView.scss'
import { useStateValue } from '../../state';

export const SignInView = () => {
  const { signin } = useUserAuth()
  const { dispatch } = useStateValue()
  const nav = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ error, setError ] = useState('')

  const handleLogin = async () => {
    if (email === '' || password === '') {
      setError("Preencha todos os campos")
      return
    }
    const res = await signin({ email, password })
    console.log(res)
    if(!res.status) {
      setError(res.msg)
      return
    }

    dispatch({ type: 'setAuthUser', value: res.userData })
    nav('/todos')
  }

  return (
    <div className='signin-container'> 
      <div className='gl-content'>
        <label className="label"> RASBET </label>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => [setEmail(e.target.value), setError("")]}
          />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => [setPassword(e.target.value), setError("")]}
          />
        <label className='label-error'> {error} </label>

        <SignInButton text="Entrar" onClick={handleLogin} />
        <label className='label-signup'>
          Não tem conta?
          <b className='strong'>
            <Link to="/signup">&nbsp;Registe-se</Link>
          </b>
        </label>
      </div>
    </div>
  )
}
