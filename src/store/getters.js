export default {
  getContentLoaded(state) {
    return false
  },
  getIsAdmin(state) {
    const employee_type = state.currentUser.employee_type
    return employee_type == 1 || employee_type == 'Admin'
  }
}
