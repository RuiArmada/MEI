import React, {useState} from 'react';
import { Input } from "../items/Input"
import { SignInButton } from "../items/SignInButton";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from '../../hooks/useAuth'
import '../../css/views/SignInView.scss'

export const SignUpView = () => {
  const { signup } = useUserAuth();
  const nav = useNavigate();

  const [ error, setError ] = useState('')
  const [ userData, setUserData ] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confPassword: '',
    birthday: '',
    NIF: '',
    NIC: '',
  })

  const handleLogin = async () => {
    const isMissing = Object.values(userData).reduce((prev, curr) => (prev + curr).trim())
    if (isMissing === '') {
      setError("Preencha todos os campos")
      return
    }
    if (userData.password !== userData.confPassword) {
      setError("As passwords têm de ser iguais")
      return
    }
    if (getAge(userData.birthday) < 18) {
      setError("Utilizador deve ser maior de 18 anos")
      return
    }

    const res = await signup({ ...userData, birthday: (new Date(userData.birthday)).getTime() })
    console.log(res)
    if(!res.status) {
      setError(res.msg)
      return
    }
    nav('/signin')
  }

  return (
    <div className='signin-container'> 
      <div className='gl-content'>
        <label className="label"> RASBET </label>
        <Input
          type="text"
          placeholder="Insira o seu primeiro nome"
          value={userData.firstName}
          onChange={(e) => [setUserData({ ...userData, firstName: e.target.value}), setError("")]}
          />
        <Input
          type="text"
          placeholder="Insira o seu último nome"
          value={userData.lastName}
          onChange={(e) => [setUserData({ ...userData, lastName: e.target.value}), setError("")]}
          />
        <Input
          type="text"
          placeholder="Insira o seu username"
          value={userData.username}
          onChange={(e) => [setUserData({ ...userData, username: e.target.value}), setError("")]}
          />
        <Input
          type="email"
          placeholder="Insira o seu e-mail"
          value={userData.email}
          onChange={(e) => [setUserData({ ...userData, email: e.target.value}), setError("")]}
          />
        <Input
          type="password"
          placeholder="Insira a sua password"
          value={userData.password}
          onChange={(e) => [setUserData({ ...userData, password: e.target.value}), setError("")]}
          />
        <Input
          type="password"
          placeholder="Confirme a password"
          value={userData.confPassword}
          onChange={(e) => [setUserData({ ...userData, confPassword: e.target.value}), setError("")]}
          />
        <Input
          type="date"
          placeholder="Insira a sua data de nascimento"
          value={userData.birthday}
          onChange={(e) => [setUserData({ ...userData, birthday: e.target.value}), setError("")]}
          />
        <Input
          type="text"
          placeholder="Insira o seu NIF"
          value={userData.NIF}
          onChange={(e) => [setUserData({ ...userData, NIF: e.target.value}), setError("")]}
          />
        <Input
          type="text"
          placeholder="Insira o seu NIC"
          value={userData.NIC}
          onChange={(e) => [setUserData({ ...userData, NIC: e.target.value}), setError("")]}
          />

        <label className='label-error'> {error} </label>

        <SignInButton text="Registar" onClick={handleLogin} />

        <label className='label-signup'>
          Já tem conta?
          <b className='strong'>
            <Link to="/signin">&nbsp;Faça login</Link>
          </b>
        </label>
      </div>
    </div>
  );
};
