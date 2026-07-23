import React from 'react'
import { useForm } from 'react-hook-form'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

type LoginForm = { email: string; password: string }

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginForm>()
  const navigate = useNavigate()

  const onSubmit = async (values: LoginForm) => {
    const auth = getAuth()
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      navigate('/app')
    } catch (err) {
      console.error(err)
      alert('Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded shadow bg-white dark:bg-slate-800 w-96">
        <h2 className="text-xl mb-4">Sign in</h2>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input className="mt-1 block w-full" {...register('email')} />
        </label>
        <label className="block mb-2">
          <span className="text-sm">Password</span>
          <input type="password" className="mt-1 block w-full" {...register('password')} />
        </label>
        <button type="submit" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Sign in</button>
      </form>
    </div>
  )
}

export default LoginPage
