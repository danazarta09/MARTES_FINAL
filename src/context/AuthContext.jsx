import { createContext, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const login = (username, password) => {
    // Usuario 1
    if (username === 'laura' && password === '12345') {
      setUser({ username: 'laura' })
      toast.success('inicio exitoso!')
      navigate('/usuarios')

    // Usuario 2
    } else if (username === 'admin' && password === '1234') {
      setUser({ username: 'admin' })
      toast.success('Inicio exitoso!')
      navigate('/usuarios')

    // Si no coincide ninguno
    } else {
      toast.error('Informacion incorrecta')
    }
  }

  const logout = () => {
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}