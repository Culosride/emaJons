import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const token = localStorage.getItem("access-token")
    let isAdmin = false
    let status = "BasicUser"

    if (token) {
        const decoded = jwtDecode(token)
        const { username, roles } = decoded.UserInfo

        isAdmin = roles.includes('Admin')

        if (isAdmin) status = "Admin"

        return { username, roles, status, isAdmin }
    }

    return { username: '', roles: [], isAdmin, status }
}
export default useAuth
